# Spotify Project
- - -
Create an event with the perfect playlist everyone loves.

## Backend
- - -
### Start (Docker)
To start the backend, you can either use the command:
```shell
docker-compose up
```
or in the /backend folder the command:
```shell
npm run start
```

### Entities Structure
![alt text](entities.png "Entities")

### Backend Routes
For almost all routes it is required to set the header field "Authorization" with a valid access_token.

The access_token must be a currently valid one issued by the spotify api through this backend and is valid for a maximum
of one hour.

While the access_token is valid a new access_token can be request by calling /account/refresh_token route which provides
a new access token.

Once the token is expired it cant be used anymore to make any requests and a new login is required.

### Auth Middleware
| method                  | codes    | description                                        |
|-------------------------|----------|----------------------------------------------------|
| verifySpotifyAccess     | 401      | checks authorization header field for valid token  |       
| verifyEventAccess       | 401, 403 | checks user is part of the event                   |
| verifyParticipantAccess | 401, 403 | checks user is at least a participant in the event |
| verifyAdminAccess       | 401, 403 | checks user is at least a admin in the event       |
| verifyOwnerAccess       | 401, 403 | checks user is the owner of the event              |

### Spotify Authentication ( /account )
| method | route                  | codes    | Middleware          | description                                     |
|--------|------------------------|----------|---------------------|-------------------------------------------------|
| GET    | /login                 | -        | -                   | redirects the user to the spotify login         |       
| GET    | /login_response        | tbd      | -                   | callback from spotify, redirects user           |
| PUT    | /refresh_token         | 200, 400 | verifySpotifyAccess | trades the refresh_token for a new access_token |
| GET    | /spotifyUserId         | 200      | verifySpotifyAccess | returns the spotify user id of this token       |
| GET    | /remaining_expiry_time | 200      | verifySpotifyAccess | returns in ms how long the token is still valid |
| PUT    | /logout                | 204      | verifySpotifyAccess | resets the spotify access_token                 |

TODO: /account/login_response redirect sollte mit frontend abgesprochen werden, wo genau redirected werden soll

### Event ( /events )
| method | route     | codes    | Middleware          | description                                        |
|--------|-----------|----------|---------------------|----------------------------------------------------|
| GET    | /         | todo     | verifySpotifyAccess | returns all events of this user                    |
| POST   | /         | 200, 500 | verifySpotifyAccess | create new event with the user as owner            |
| GET    | /:eventId | 200, 404 | verifyEventAccess   | returns one event and adds the user as participant |
| PUT    | /:eventId | 200, 400 | verifyEventAccess   | removes the user (except owner) from the event     |
| DELETE | /:eventId | 200, 400 | verifyOwnerAccess   | the owner can delete this event                    |

### Event Participants ( /events/:eventId/participants )
| method | route                        | codes              | Middleware        | description                   |
|--------|------------------------------|--------------------|-------------------|-------------------------------|
| GET    | /                            | 200, 400           | verifyAdminAccess | fetch detailed users of event |
| PUT    | /:spotifyUserId              | 204, 400, 403, 404 | verifyAdminAccess | kicks user from event         |
| PUT    | /:spotifyUserId/:permissions | 204, 400, 403, 404 | verifyAdminAccess | change user permissions       |

### TODO: Event Playlist ( /events/:eventId/tracks )
| method | route                      | codes         | Middleware              | description                         |
|--------|----------------------------|---------------|-------------------------|-------------------------------------|
| GET    | /                          | 200           | verifyEventAccess       | return all event tracks             |
| GET    | /spotifyPlaylistIds        | 200           | verifyEventAccess       | return ids of all playlists         |
| GET    | /:spotifyPlaylistId        | 200, 404      | verifyEventAccess       | returns list of all playlist tracks |
| POST   | /:spotifyTrackId           | 201, 429      | verifyParticipantAccess | propose new event track             |
| PUT    | /:spotifyTrackId/:status   | 200, 400, 404 | verifyAdminAccess       | change event track status           |
| POST   | /:spotifyPlaylistId        | 201, 429      | verifyParticipantAccess | propose new playlist                |
| PUT    | /:spotifyPlaylistId/accept | 200, 404      | verifyAdminAccess       | accept all songs from a playlist    |
| PUT    | /:spotifyPlaylistId/remove | 404           | verifyAdminAccess       | remove all songs from a playlist    |
Note: The status code 429 is returned by spotify if the app has exceeded its rate limits.

## Frontend
- - -
todo