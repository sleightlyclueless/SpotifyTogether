# Backend - Routes
- GET       / -> "Spotify anmelden" [response-json: {userToken: "xxxxx"}]
- GET       /:userToken [response-json: ]                                                           # Backend: Check Token & Login?

- GET       /events/:userToken [response-json: ]                                                    # show all events 
- GET       /events/:userToken/:eventToken [response-json: ]                                        # show specific event or add user to event
- PUT       /events/:userToken/:eventToken [response-json: ]                                        # leave specific event
- POST      /events/:userToken [response-json: {eventToken: "xxxxxxx"}]                             # create new event
- DELETE    /events/:userToken/:eventToken                                                          # delete event by its id

- GET       /events/:userToken/:eventToken/settings/participants [response-json: ]                           # show users of event
- PUT       /events/:userToken/:eventToken/settings/participants/:targetUserToken [response-json: ]          # kick user (blacklist later, lol)
- PUT       /events/:userToken/:eventToken/settings/participants/:targetUserToken/:roleId [response-json: ]  # change user role
                                                                                                             # /settings -> middleware for other settings, such as /settings/changeTime, ...

- GET /spotifyToken/:userToken                                                                      # get the spotify access token from userToken / DB