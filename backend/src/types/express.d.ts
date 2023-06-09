import {User} from '../entities/deprecated';

declare global {
    namespace Express {
        interface Request {
            user: User | null;
        }
    }
}