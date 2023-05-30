import express from 'express';
import http from 'http';

import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';

import { AuthController } from './controller/auth.controller';
import { DiaryController } from './controller/diaryEntry.controller';
import { TagController } from './controller/tag.controller';
import { DiaryEntry, DiaryEntryTag, User } from './entities';
import { Auth } from './middleware/auth.middleware';

const PORT = 4000;
const app = express();

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  diaryEntryRepository: EntityRepository<DiaryEntry>;
  diaryEntryTagRepository: EntityRepository<DiaryEntryTag>;
  userRepository: EntityRepository<User>;
};

export const initializeServer = async () => {
  // dependency injection setup
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.diaryEntryRepository = DI.orm.em.getRepository(DiaryEntry);
  DI.diaryEntryTagRepository = DI.orm.em.getRepository(DiaryEntryTag);
  DI.userRepository = DI.orm.em.getRepository(User);

  // example middleware
  app.use((req, res, next) => {
    console.info(`New request to ${req.path}`);
    next();
  });

  // global middleware
  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.use(Auth.prepareAuthentication);

  // routes
  app.use('/auth', AuthController);
  app.use('/diaryEntries', Auth.verifyAccess, DiaryController);
  app.use('/tags', Auth.verifyAccess, TagController);

  DI.server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

if (process.env.environment !== 'test') {
  initializeServer();
}
