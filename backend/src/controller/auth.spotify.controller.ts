import {Router} from "express";
import {DI} from "../index";
import * as querystring from "querystring";
import randomstring from "randomstring";

import axios from "axios";

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
        console.log("error");
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        axios.post(
            'https://accounts.spotify.com/api/token',
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
            }).then((response) => {
            console.log("token callback");
            console.log(response.data);

            // fetch spotify user id
            // create user if not existing
            // otherwise update token

        }).catch(function (error: Error) {
            // TODO: handle error
            console.log(error);
        });
    }
});

router.get('/refresh_login/:spotifyToken', async (req, res) => {
    console.log("check spotify login with token");

    // -> token ?

    // case 1: token still valid -> do nothing, send back old token

    // case 2: token invalid -> check refresh token
    //  -> success: send back refreshed token
    //  -> fail: send back error -> force client to make new login request ?

    return res.status(201).send("ok token");
});

router.get('/spotifyUserId/:spotifyToken', async (req, res) => {
    console.log("check spotify login with token");

    // fetch spotify user id from token ?

    return res.status(201).send("ok token");
});

router.get('/logout', async (req, res) => {
    // reset token ?
    return res.status(201).send("ok");
});

export const SpotifyAuthController = router;