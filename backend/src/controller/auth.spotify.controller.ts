import {Router} from "express";
import {DI} from "../index";
import * as querystring from "querystring";
import randomstring from "randomstring";

import axios from "axios";
import {User} from "../entities/User";
import {SpotifyAuth} from "../middleware/auth.spotify.middleware";

const router = Router({mergeParams: true});

router.get('/login', async (req, res) => {
    const state = randomstring.generate(16);
    let scope = ""; // https://developer.spotify.com/documentation/web-api/concepts/scopes
    scope += "user-read-playback-state user-modify-playback-state user-read-currently-playing"; // Spotify connect
    scope += " app-remote-control streaming"; // Playback
    scope += " playlist-read-private playlist-read-collaborative playlist-modify-public"; // Playlists
    scope += " user-read-playback-position user-top-read user-read-recently-played"; // Listening History
    scope += " user-read-email user-read-private"; // Users

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
                } else {
                    // create new user
                    user = new User(userResponse.data.id, tokenResponse.data.access_token, tokenResponse.data.refresh_token);
                    await DI.em.persistAndFlush(user);
                }
                return res.status(201).json({access_token: user.spotifyAccessToken});
            }).catch(function (error: Error) {
                return res.status(400).send(error); // TODO: rework error
            });
        }).catch(function (error: Error) {
            return res.status(400).send(error); // TODO: rework error
        });
    }
});

router.put('/refresh_token', SpotifyAuth.verifyAccess, async (req, res) => {
    const user: User = req.user;
    axios.post(
        'https://accounts.spotify.com/api/token',
        {
            grant_type: 'refresh_token',
            refresh_token: user.spotifyRefreshToken
        },
        {
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(DI.spotifyClientId + ':' + DI.spotifyClientSecret).toString('base64')),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((tokenResponse) => {
        user.spotifyAccessToken = tokenResponse.data.access_token;
        DI.em.persistAndFlush(user);
        return res.status(200).send("alles cool bro"); // TODO: rework error
    }).catch(function (error: Error) {
        return res.status(400).send(error); // TODO: rework error
    });
});

router.get('/spotifyUserId/:spotifyToken', SpotifyAuth.verifyAccess, async (req, res) => {
    const user: User = req.user;
    return res.status(201).json({spotifyUserId: user.spotifyId});
});

router.put('/logout', SpotifyAuth.verifyAccess, async (req, res) => {
    // reset token ?
    return res.status(201).send("ok");
});

export const SpotifyAuthController = router;