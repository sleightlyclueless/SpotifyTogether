import {User} from "../entities/User";

declare global {
    namespace Express {
        interface Request {
            user: User | null,
            eventUser: EventUser | null,
        }
    }
}