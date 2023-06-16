import {User} from "../entities/User";

declare global {
    namespace Express {
        interface Request {
            userSpotifyAccessToken: string | null,
            user: User | null,
        }
    }
}
