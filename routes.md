# Backend - Routes
- GET /account/login                    # redirects the user to the spotify login screen
- GET /account/login_response           # called by the spotify api after the user grants or denies permission

All following routes require the header "Authorization" field to be set with a valid token.
- GET /account/refresh_login           # checks if the current token is valid, otherwise tries to refresh it. Else returns an error
- GET /account/spotifyUserId       # returns the spotify user id of this the set token
- GET /account/logout             # todo

- GET       /events [response-json: ]                                                    # show all events 
- GET       /events/:eventToken [response-json: ]                                        # show specific event or add user to event
- PUT       /events/:eventToken [response-json: ]                                        # leave specific event
- POST      /events [response-json: {eventToken: "xxxxxxx"}]                             # create new event
- DELETE    /events/:eventToken                                                          # delete event by its id

- GET       /events/:eventToken/settings/participants [response-json: ]                           # show users of event
- PUT       /events/:eventToken/settings/participants/:targetUserToken [response-json: ]          # kick user (blacklist later, lol)
- PUT       /events/:eventToken/settings/participants/:targetUserToken/:roleId [response-json: ]  # change user role
                                                                                                             # /settings -> middleware for other settings, such as /settings/changeTime, ...

- GET /spotifyToken/:userToken                                                                      # get the spotify access token from userToken / DB