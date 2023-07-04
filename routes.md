# Backend - Routes
All following routes require the header "Authorization" field to be set with a valid token.

SpotifyController
/account
- GET       /generate [response-json: ]                           # algorithm to generate playlist
- GET       /login [response-json: ]                              # redirects the user to the spotify login screen
- GET       /login_response [response-json: ]                     # called by the spotify api after the user grants or denies permission
- GET       /refresh_token [response-json: ]                      # checks if the current token is valid, otherwise tries to refresh it. Else returns an error
- GET       /spotifyUserId [response-json: ]                      # returns the spotify user id of this the set token
- GET       /remaining_expiry_time [response-json: ]              # returns the remaining time until the token expires
- GET       /logout [response-json: ]                             # logout user
- GET       /spotifyToken/:userToken [response-json: ]            # get the spotify access token from userToken / DB

EventController  
- GET       / [response-json: ]                                   #fetch all events of user  
- POST      / [response-json: ]                                   #create new event  
- GET       /:eventId [response-json: ]                           #fetch event by id  
- PUT       /:eventId [response-json: ]                           #leave event  
- DELETE    /:eventId [response-json: ]                           #delete event by id  

TracksController
/:eventId/tracks
- GET       / [response-json: ]                                   #fetch all event tracks
- GET       /spotifyPlaylistIds [response-json: ]                 #fetch all spotify playlist ids
- GET       /spotifyPlaylistId [response-json: ]                  #fetch all tracks of a specific spotify playlist
- POST      /spotifyTrackId [response-json: ]                     #add a track to the event
- PUT       /spotifyTrackId/:status [response-json: ]             #change the status of a track
- POST      /spotifyPlaylistId [response-json: ]                  #propose Playlist to the event
- PUT       /spotifyPlaylistId/accept [response-json: ]           #accept the proposed playlist
- PUT       /spotifyPlaylistId/remove [response-json: ]           #remove the proposed playlist

EventParticipantsController
/:eventId/participants
- GET       / [response-json: ]                                   #fetch all participants of an event
- PUT       /:spotifyUserId [response-json: ]                     # kick user out of event
- PUT       /:spotifyUserId/:permissions [response-json: ]        # change user permissions

EventSettingsController
/:eventId/settings
TODO