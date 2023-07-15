import {Router} from "express";
import {DI} from '../index';
import axios from "axios";
import {Auth} from "../middleware/auth.middleware";
import {EventTrack, TrackStatus} from "../entities/EventTrack";
import {SpotifyTrack} from "../entities/SpotifyTrack";
import {Playlist} from "../entities/Playlist";

const router = Router({mergeParams: true});

// fetch all event tracks
// TODO: add query parameters for searching, filtering, limit & offset etc. (if required by frontend)
router.get('/', async (req, res) => {
    if (!req.event!.eventTracks.isInitialized()) req.event!.eventTracks.init();
    const eventTracks = req.event!.eventTracks;
    res.status(200).json(eventTracks);
});

// fetch ids of all playlists
router.get('/spotifyPlaylistIds', async (req, res) => {
    if (!req.event!.playlists.isInitialized()) req.event!.playlists.init();
    const playlists = req.event!.playlists;
    res.status(200).json(playlists);
});

// fetch all tracks of playlist
router.get('/:spotifyPlaylistId', async (req, res) => {
    const playlist = await DI.em.findOne(Playlist,
        {
            id: req.params.spotifyPlaylistId,
            event: {id: req.event!.id}
        },
        {populate: ['eventTracks']}
    );
    if (playlist) return res.status(200).json(playlist.eventTracks);
    else return res.status(404).end();
});

// propose new event track
router.post('/:spotifyTrackId', Auth.verifyUnlockedEventParticipantAccess, async (req, res) => {
    let track = await DI.em.findOne(SpotifyTrack, req.params.spotifyTrackId);
    if (track == undefined) {
        axios.get(
            "https://api.spotify.com/v1/tracks" + req.params.spotifyTrackId,
            {
                headers: {
                    Authorization: `Bearer ${req.user!.spotifyAccessToken}`,
                },
            }
        ).then(async (trackResponse) => {
            // push track to events
            track = new SpotifyTrack(trackResponse.data.id, trackResponse.data.duration, trackResponse.data.genre, trackResponse.data.artist);
            await DI.em.persist(track);
        }).catch(function (error) {
            return res.status(error.status).send(error);
        });
    }

    // create & persist new event track
    const newEventTrack = new EventTrack(TrackStatus.PROPOSED, track!, req.event!);
    await DI.em.persistAndFlush(newEventTrack);
    return res.status(201).json(newEventTrack);
});

// change event track status
router.put('/:spotifyTrackId/:status', Auth.verifyEventAdminAccess, async (req, res) => {
    const eventTrack = await DI.em.findOne(EventTrack,
        {
            track: {id: req.params.spotifyTrackId},
            event: {id: req.event!.id},
        }
    );
    if (eventTrack) {
        const newTrackStatus = TrackStatus[req.params.status.toUpperCase() as keyof typeof TrackStatus];
        if (newTrackStatus != undefined) {
            if (newTrackStatus == TrackStatus.PROPOSED || newTrackStatus == TrackStatus.GENERATED)
                return res.status(400).json({message: "Cannot set status proposed or generated."});
            eventTrack.status = newTrackStatus;
            await DI.em.persistAndFlush(eventTrack);
            return res.status(200).end();
        } else res.status(400).json({message: "Failed to cast status to enum type."});
    } else return res.status(404).json({message: "EventTrack not found."});
});

// propose playlist
router.post('/:spotifyPlaylistId', Auth.verifyUnlockedEventParticipantAccess, async (req, res) => {
    // remove playlists if exists
    await removePlaylist(req.params.spotifyPlaylistId, req.event!.id);

    // (re-)create playlist
    axios.get(
        "https://api.spotify.com/v1/playlists" + req.params.spotifyPlaylistId,
        {
            headers: {
                Authorization: `Bearer ${req.user!.spotifyAccessToken}`,
            },
        }
    ).then(async (listResponse) => {
        // create new playlist from spotify data
        const playlist = new Playlist(listResponse.data.id);

        for (const item of listResponse.data.tracks.items) {
            const trackObject = item.TrackObject;

            // fetch or create SpotifyTrack
            let newTrack = await DI.em.findOne(SpotifyTrack, trackObject.id);
            if (!newTrack) {
                newTrack = new SpotifyTrack(trackObject.data.id, trackObject.data.duration, trackObject.data.genre, trackObject.data.artist);
                await DI.em.persist(newTrack);
            }

            // create & add EventTrack to Playlist
            const newEventTrack = new EventTrack(TrackStatus.PROPOSED, newTrack, req.event!);
            playlist.eventTracks.add(newEventTrack)
            await DI.em.persist(newEventTrack);
        }
        await DI.em.persistAndFlush(playlist);
        return res.status(201).json(playlist);
    }).catch(function (error) {
        return res.status(error.status).send(error);
    });
});

// accept all tracks from this playlist
router.put('/:spotifyPlaylistId/accept', Auth.verifyEventAdminAccess, async (req, res) => {
    const playlist = await DI.em.findOne(Playlist,
        {
            id: req.params.spotifyPlaylistId,
            event: {id: req.event!.id}
        },
        {populate: ['eventTracks']}
    );
    if (playlist) {
        for (const track of playlist.eventTracks) {
            if (track.status == TrackStatus.PROPOSED) {
                track.status = TrackStatus.ACCEPTED_PLAYLIST;
                await DI.em.persist(track);
            }
        }
        playlist.accepted = true;
        await DI.em.persistAndFlush(playlist);
        return res.status(200).json(playlist);
    } else return res.status(404).json({message: "Playlist not found."});
});

// remove playlist & corresponding tracks
router.put('/:spotifyPlaylistId/remove', Auth.verifyEventAdminAccess, async (req, res) => {
    const removedPlaylist = await removePlaylist(req.params.spotifyPlaylistId, req.event!.id);
    if (removedPlaylist) return res.status(200).end();
    else return res.status(404).json({message: "Playlist not found."});
});

// helper function to remove one playlist
async function removePlaylist(spotifyPlaylistId: string, eventId: string) {
    const playlist = await DI.em.findOne(Playlist,
        {
            id: spotifyPlaylistId,
            event: {id: eventId}
        },
        {populate: ['eventTracks']}
    );
    if (playlist) {
        for (const eventTrack of playlist.eventTracks) {
            // don't remove if manually accepted / generated / denied
            if (eventTrack.status == TrackStatus.ACCEPTED
                || eventTrack.status == TrackStatus.GENERATED
                || eventTrack.status == TrackStatus.DENIED) continue;
            else {
                if (eventTrack.playlists.length <= 1) {
                    // track is only in this playlist, remove if not in any other event
                    const eTrack = await DI.em.find(EventTrack, {track: {id: eventTrack.track.id}});
                    if (eTrack && eTrack.length > 1) await DI.em.remove(eventTrack);
                } else {
                    // track is proposed in multiple playlists (not accepted anywhere)
                    if (eventTrack.status == TrackStatus.PROPOSED) continue;
                    else {
                        // check if track was accepted in any other playlist
                        let found: boolean = false;
                        for (const playlist of eventTrack.playlists) {
                            if (playlist.id != spotifyPlaylistId && playlist.accepted) {
                                found = true;
                                break;
                            }
                        }
                        if (found) break; // keep accepted

                        // not accepted in any other playlist -> reset to proposed
                        eventTrack.status = TrackStatus.PROPOSED;
                    }
                }
            }
        }
        await DI.em.removeAndFlush(playlist);
        return true;
    } else return false;
}


export const TracksController = router;