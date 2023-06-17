import {DI} from '../src';
import {Auth} from '../src/middleware/auth.middleware';

export const loginUser = async () => {
    const user = await DI.userRepository.findOne({
        email: 'hallo123@fwe345.de',
    });
    return {
        token: Auth.generateToken({
            email: user!.email,
            firstName: user!.firstName,
            id: user!.id,
            lastName: user!.lastName,
        }),
        user: user!,
    };
};
