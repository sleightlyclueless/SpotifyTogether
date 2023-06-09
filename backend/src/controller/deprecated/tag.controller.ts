import {Router} from 'express';

import {DI} from '../../index';

const router = Router();

router.get('/', async (req, res) => {
    /*const tags = await DI.diaryEntryTagRepository.find({
        creator: req.user,
    });*/
    res.status(200).send("tags");
});

export const TagController = router;
