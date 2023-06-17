import type {EntityManager} from '@mikro-orm/core';
import {Seeder} from '@mikro-orm/seeder';

export class TestSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        //const hashedPassword = await Auth.hashPassword('123456');
        /*const user = em.create(User, {
            email: 'hallo123@fwe345.de',
            password: hashedPassword,
            firstName: 'Daniel',
            lastName: 'Wohlfarth',
            createdAt: new Date(),
            updatedAt: new Date(),
        });*/
    }
}
