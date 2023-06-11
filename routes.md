# Backend - Routes

## Backend - Routes

For almost all routes it is required to set the header field "Authorization" with a valid access_token.

The access_token must be a currently valid one issued by the spotify api through this backend and is valid for a maximum
of one hour.

While the access_token is valid a new access_token can be request by calling /account/refresh_token route which provides
a new access token.

Once the token is expired it cant be used anymore to make any requests and a new login is required.

### Spotify Authentication

The following two routes are the only ones which don't require a spotify token to set as header Authorization field.

| method | route                   | codes | description                             |
|--------|-------------------------|-------|-----------------------------------------|
| GET    | /account/login          | -     | redirects the user to the spotify login |       
| GET    | /account/login_response | tbd   | callback from spotify, redirects user   |

The following account routes require a valid access_token.

Note: The spotify authentication middleware might return a 401 if the access_token is invalid.

| method | route                  | codes         | description                                     |
|--------|------------------------|---------------|-------------------------------------------------|
| GET    | /account/refresh_token | 200, 201, 400 | trades the refresh_token for a new access_token |       
| GET    | /account/spotifyUserId | 200, 400      | returns the spotify user id of this token       |       
| GET    | /account/logout        | tbd           | todo                                            |

### Event

Note: The spotify authentication middleware might return a 401 if the access_token is invalid.

| method | route            | codes | description                                        |
|--------|------------------|-------|----------------------------------------------------|
| GET    | /events          | -     | returns all events of this user                    |
| POST   | /events          |       | create new event with the user as owner            |
| GET    | /events/:eventId |       | returns one event and adds the user as participant |

Note: The role authorization middleware might return a 401 if the user lacks required participant or higher
permissions.

| method | route            | codes | description                                    |
|--------|------------------|-------|------------------------------------------------|
| PUT    | /events/:eventId |       | removes the user (except owner) from the event |
| DELETE | /events/:eventId |       | the owner can delete this event                |

- POST /events/:eventToken/add/:SpotifyTrack [response-json: ]                    # Add Spotify-Track to Event

### Event Settings

Note 1: The spotify authorization middleware might return a 401 if the access_token is invalid.

Note 2: The role authorization middleware might return a 401 if the user lacks required admin or higher permissions.

| method | route                                                         | codes | description                        |
|--------|---------------------------------------------------------------|-------|------------------------------------|
| GET    | /events/:eventId/settings/participants                        |       | show users of event                |
| PUT    | /events/:eventId/settings/participants/:spotifyUserId         |       | kicks a participant (except owner) |
| PUT    | /events/:eventId/settings/participants/:spotifyUserId/:roleId |       | change user role                   |

## Frontend Routes
