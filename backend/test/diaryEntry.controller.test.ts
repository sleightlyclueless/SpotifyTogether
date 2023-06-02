import request from 'supertest';

import {DI, initializeServer} from '../src';
import {TestSeeder} from '../src/seeders/TestSeeder';
import {loginUser} from './helper';

describe('DiaryEntryController', () => {
    beforeAll(async () => {
        await initializeServer();
        const seeder = DI.orm.getSeeder();
        DI.orm.config.set('dbName', 'express-test-db');
        DI.orm.config.getLogger().setDebugMode(false);
        DI.orm.config.set('allowGlobalContext', true);
        await DI.orm.config.getDriver().reconnect();
        await DI.orm.getSchemaGenerator().refreshDatabase();
        await seeder.seed(TestSeeder);
    });

    afterAll(async () => {
        await DI.orm.close(true);
        DI.server.close();
    });

    it('can create a new entry', async () => {
        const {token} = await loginUser();
        const response = await request(DI.server)
            .post('/diaryEntries')
            .set('Authorization', token)
            .send({title: 'test', content: 'some content'});

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.title).toBe('test');
        expect(response.body.content).toBe('some content');
        expect(response.body.creator).toBeDefined();
    });
});
