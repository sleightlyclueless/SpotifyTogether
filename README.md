# Spotify Project
- - -
Create an event with the perfect playlist everyone loves.

## Team Organisation
- - -
Wir haben eine klare Aufgabenteilung zwischen Backend und Frontend gemacht mit der alle im Team zufrieden waren. 
Björn, Noah und Antoine haben sich ums das Backend, Paul und Sebi nur am Frontend gekümmert.

### Team Frontend

##### Sebi & Paul:

### Team Backend:

##### Noah & Björn & Antoine:
- regelmäig Freitags & Samstags online getroffen
   - Zusammenarbeit in Jetbrains Webstorm code with me 
- event.controller-struktur konzept und implementierung
   - auth.spotify.controller.ts
   - event.controller.ts
   - event.algorithm.controller.ts 
   - event.controller.ts
   - event.settings.controller.ts 
   - Integration des participants-controllers
- auth middleware
  - auth.middleware.ts
- entity-relationships konzept + implementierung
- Spotify-Anbindung
- debugging mit Team Frontend (schnelles Troubleshooting bei integration des Frotend)
- Hilfe bei Integration im Frontend
- backend readme

Disclaimer Teamarbeit Noah/Björn/Antoine:

Coden zu zweit ist lustiger, deswegen haben wir das Code-with-me-Feature fleißig benutzt und bessere Ergebnisse abgeliefert,
da direkte Kommunikation sowie schnelles Troubleshooting für uns wichtiger waren als eigene Bearbeitungszeit.
Da wir aus vorherigen Modulen zusammen schon ähnliche Codestandards übernommen haben fiel es uns leicht eine gehobene Codequalität abzuliefern.

Disclaimer Antoine
In den letzten Wochen vor der Angabe ist bei mir ein nahestehender verstorben. Eigentlich wollte ich das Testing noch möglichst groß behandeln, aber das hat jetzt Sebi aus dem Frontend Team übernommen, um mich ein bisschen zu entlasten.

## Backend
- - -
### Requirements
- Node.js & NPM
- Docker & Docker Compose

### Our setup
- Ubuntu 22.04
- Node.js v18.14.1
- Package Manager 9.3.1
- Docker version 20.10.17
- Docker-compose version 1.29.2

- - -
### Start (Docker)
To start the backend, you can either use the command:
```shell
docker-compose up
```

### Entities Structure
![alt text](entities.png "Entities")
Bla Bla Bla irgendwas zu Entities

### Spotify Authorization
![alt text](auth-code-flow.png "Spotify Authorization")
Als Anbindung an die Spotify API verwenden wir den 
[Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow) OAuth2 flow.
Wir lagern somit sämtliche Authentification an Spotify aus und verwenden ihren access_token zum Validieren des Nutzers.
...

### Backend Routes
For almost all routes it is required to set the header field "Authorization" with a valid spotify access_token.

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

### Event Playlist ( /events/:eventId/tracks )
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

### Event Settings ( /events/:eventId/settings )
| method | route          | codes   | Middleware        | description                 |
|--------|----------------|---------|-------------------|-----------------------------|
| PUT    | /generateNewId | 200,500 | verifyOwnerAccess | generates new ID for Event  | 
| PUT    | /id/:newID     | 200,400 | verifyOwnerAccess | set custom ID for Event     |
| PUT    | /name/:newName | 200     | verifyOwnerAccess | set new Name for Event      |
| PUT    | /date/:newDate | 200     | verifyOwnerAccess | set new date for event      |
| PUT    | /lock          | 200     | verifyOwnerAccess | close Event for new Entries |
| PUT    | /unlock        | 200     | verifyOwnerAccess | open Event for new Entries  |

### Event Algorithm ( /events/:eventId/algorithm )
| method | route     | codes              | Middleware             | description                                |
|--------|-----------|--------------------|------------------------|--------------------------------------------|
| PUT    | /generate | 500, 200, 400, 404 | verifyEventOwnerAccess | Generates songs based on all participants. |

### CI/CD ?
todo

### Tests
todo

## Frontend
- - -
todo
