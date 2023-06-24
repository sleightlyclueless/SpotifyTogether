import {Router} from "express";
import * as querystring from "querystring";
import randomstring from "randomstring";
import axios from "axios";
import {DI} from "../index";
import {User} from "../entities/User";
import {Event} from "../entities/Event";
import {Auth} from "../middleware/auth.middleware";
import {EventUser, Permission} from "../entities/EventUser";

const router = Router({mergeParams: true});

router.get('/sampleEvent', async (req, res) => {
    const event = new Event("eventId");
    const access_token1: string = "BQCy8QL6uz327kal8bUW0coIYCi5UyEfnyH6HtF1eLToIb569moDIAuTne8G1CzYlpypWcAQDV-PJAjEj0b4_nHqK_aux434dwZhQbHg7XWafrFhvuICY6V7sSOkBmHAOJFWU4YV9b8ytin85nY-aLstTkrlytIEHhlA0eW3Rnw3RQw1g4GJb3NbKbQPiKZzf2G7dcxujNFB-nptzRKpJI2HAxtH5iD8-dXj7zy4irXoaM-Mo5EOuvoVvTd__KUAuUldwtSHGQtCe4EUzganzPmbWqM";
    const access_token2: string = "";
    const user1 = new User("id1", access_token1, "", 0, 0);
    const user2 = new User("id2", access_token2, "", 0, 0);
    const eventUser1 = new EventUser(Permission.ADMIN, user1, event);
    const eventUser2 = new EventUser(Permission.ADMIN, user2, event);
    await DI.em.persist(user1).persist(user2);
    await DI.em.persist(eventUser1).persist(eventUser2);
    await DI.em.persistAndFlush(event);
});

//algorithm
// for each user in EventUser assigned to event: Get/me/top/artists or tracks. set limit for returned Objects(20?)
//  - responseArtists/respnseTracks are saved in Datastructure responseObject.items.ArtistObject.id
// sort the entries by frequency
//
router.get('/generate', async (req, res) => {
    const eventUsers = await DI.em.find(EventUser,
        {
            event: {id: "eventId"},
        },
        {
            populate: ['user']
        }
    );
    if (eventUsers) {
        // Map ArtistId|Counter
        let artistMap = new Map<string, number>();
        for (const eventUser of eventUsers) {
            // get new access_token (old one is not invalidated)
            /*let access_token = null;
            axios.post(
                'https://accounts.spotify.com/api/token',
                {
                    grant_type: 'refresh_token',
                    refresh_token: req.user!.spotifyRefreshToken
                },
                {
                    headers: {
                        'Authorization': 'Basic ' + (Buffer.from(DI.spotifyClientId + ':' + DI.spotifyClientSecret).toString('base64')),
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }).then((tokenResponse) => {
                access_token = tokenResponse.data.access_token;
            }).catch(function (error: Error) {
                console.log(error);
            });
            if (access_token == null) continue;*/


            // get top Artists
            await axios.get(
                "https://api.spotify.com/v1/me/top/artists",
                {
                    //TODO: set limit header field
                    headers: {
                        Authorization: 'Bearer ' + eventUser.user.spotifyAccessToken,
                    },
                }
            ).then(async (artistResponse) => {
                console.log("successful artist request");
                // reformat artists
                for (const artist of artistResponse.data.items) {
                    if (artistMap.has(artist.name)) {
                        let artistcounter = artistMap.get(artist.name);
                        if (artistcounter) artistcounter++;
                    } else artistMap.set(artist.name, 1);
                }
            }).catch(function (error) {
                console.log(error.message);
            });

        }

        console.log(artistMap);

        // crete Playlist from map
        //let artistMapSorted = new Map([...artistMap.entries()].sort()); //wilder code, nur übernommen

        return res.status(200).end();
    } else return res.status(404).end();
});


router.get('/login', async (req, res) => {
    const state = randomstring.generate(16);
    let scope = ""; // https://developer.spotify.com/documentation/web-api/concepts/scopes
    // backend scopes // TODO: rework scopes and check whats really needed
    scope += " playlist-read-private playlist-read-collaborative playlist-modify-public"; // Playlists
    scope += " user-read-playback-position user-top-read user-read-recently-played"; // Listening History
    scope += " user-read-email user-read-private"; // Users // TODO: email and subscription ? needed ?
    // frontend spotify playback scopes
    scope += " user-read-playback-state user-modify-playback-state user-read-currently-playing"; // Spotify connect
    scope += " app-remote-control streaming"; // Playback

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: DI.spotifyClientId,
            scope: scope,
            redirect_uri: DI.spotifyRedirectUri,
            state: state
        }));
});

router.get('/login_response', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        // TODO: handle error
        res.redirect('/#' + querystring.stringify({error: 'state_mismatch'}));
    } else {
        axios.post(
            "https://accounts.spotify.com/api/token",
            {
                code: code,
                redirect_uri: DI.spotifyRedirectUri,
                grant_type: 'authorization_code'
            },
            {
                headers: {
                    'Authorization': 'Basic ' + (Buffer.from(DI.spotifyClientId + ':' + DI.spotifyClientSecret).toString('base64')),
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }).then((tokenResponse) => {

            axios.get(
                "https://api.spotify.com/v1/me",
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.data.access_token}`,
                    },
                }).then(async (userResponse) => {
                let user = await DI.em.findOne(User, userResponse.data.id);
                if (user) {
                    // update user tokens
                    user.spotifyAccessToken = tokenResponse.data.access_token;
                    user.spotifyRefreshToken = tokenResponse.data.refresh_token;
                    user.expiresInMs = tokenResponse.data.expires_in * 1000; // convert to ms
                    user.issuedAt = Date.now(); // unix timestamp in ms
                    await DI.em.persistAndFlush(user);

                    res.redirect(`${DI.frontendUrl}/home?access_token=${user.spotifyAccessToken}`);
                    //return res.status(200).json({access_token: user.spotifyAccessToken});
                } else {
                    // create new user
                    let currentDate = Date.now();
                    user = new User(
                        userResponse.data.id,
                        tokenResponse.data.access_token,
                        tokenResponse.data.refresh_token,
                        tokenResponse.data.expires_in * 1000,
                        currentDate);
                    await DI.em.persistAndFlush(user);
                    console.log("new user created:", user);

                    res.redirect(`${DI.frontendUrl}/home?access_token=${user.spotifyAccessToken}`);
                    //return res.status(201).json({access_token: user.spotifyAccessToken});
                }
            }).catch(function (error: Error) {
                console.log("spotify user not found");
                console.log(error.message);
                return res.status(400).send(error); // TODO: rework error
            });
        }).catch(function (error: Error) {
            console.log("token request failed");
            return res.status(400).send(error); // TODO: rework error
        });
    }
});

router.put('/refresh_token', Auth.verifySpotifyAccess, async (req, res) => {
    axios.post(
        'https://accounts.spotify.com/api/token',
        {
            grant_type: 'refresh_token',
            refresh_token: req.user!.spotifyRefreshToken
        },
        {
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(DI.spotifyClientId + ':' + DI.spotifyClientSecret).toString('base64')),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((tokenResponse) => {
        req.user!.spotifyAccessToken = tokenResponse.data.access_token;
        DI.em.persistAndFlush(req.user!);
        return res.status(200).send("alles cool bro"); // TODO: rework
    }).catch(function (error: Error) {
        return res.status(400).send(error); // TODO: rework error
    });
});

router.get('/spotifyUserId', Auth.verifySpotifyAccess, async (req, res) => {
    return res.status(200).json({spotifyUserId: req.user!.spotifyId});
});

router.get('/remaining_expiry_time', Auth.verifySpotifyAccess, async (req, res) => {
    const remainingTime = req.user!.expiresInMs - (Date.now() - req.user!.issuedAt);
    return res.status(200).json({expires_in: remainingTime});
});

router.put('/logout', Auth.verifySpotifyAccess, async (req, res) => {
    req.user!.spotifyAccessToken = null;
    req.user!.spotifyRefreshToken = null;
    await DI.em.persistAndFlush(req.user!);
    return res.status(204).send("logout sucsessful"); // TODO: rework error
});

export const SpotifyAuthController = router;
