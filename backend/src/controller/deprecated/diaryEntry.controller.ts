import {Router} from 'express';

import {wrap} from '@mikro-orm/core';

import {DI} from '../../index';
import {CreateDiaryEntryDTO, CreateDiaryEntryDTOTag, CreateDiaryEntrySchema, DiaryEntry} from '../../entities/deprecated';

const router = Router({mergeParams: true});

router.get('/', async (req, res) => {
    const diaryEntries = await DI.diaryEntryRepository.find(
        {
            creator: req.user,
        },
        {populate: ['creator', 'tags']}
    );
    console.log(diaryEntries);
    res.status(200).send(diaryEntries);
});

router.post('/', async (req, res) => {
    const validatedData = await CreateDiaryEntrySchema.validate(req.body).catch((e) => {
        res.status(400).json({errors: e.errors});
    });
    if (!validatedData) {
        return;
    }
    const createDiaryEntryDTO: CreateDiaryEntryDTO = {
        ...validatedData,
        creator: req.user!,
    };
    const diaryEntry = new DiaryEntry(createDiaryEntryDTO);

    if (createDiaryEntryDTO.tags) {
        const {tagsWithName, tagIds} = createDiaryEntryDTO.tags.reduce<{
            tagIds: string[];
            tagsWithName: CreateDiaryEntryDTOTag[];
        }>(
            (prev, curTag) => {
                if (curTag.id) {
                    prev.tagIds.push(curTag.id);
                    return prev;
                }

                if (curTag.name) {
                    prev.tagsWithName.push({...curTag, creator: req.user!});
                    return prev;
                }
                return prev;
            },
            {
                tagIds: [],
                tagsWithName: [],
            }
        );

        const loadedTags = await DI.diaryEntryTagRepository.find({
            id: {$in: tagIds},
        });
        const mergedTags = [...loadedTags, ...tagsWithName];

        wrap(diaryEntry).assign({tags: mergedTags}, {em: DI.em});

        await DI.diaryEntryRepository.persistAndFlush(diaryEntry);
        await DI.diaryEntryRepository.populate(diaryEntry, ['tags']);
    } else {
        await DI.diaryEntryRepository.persistAndFlush(diaryEntry);
    }

    res.status(201).send(diaryEntry);
});

router.delete('/:id', async (req, res) => {
    // diary Entry laden
    const existingEntry = await DI.diaryEntryRepository.find({
        id: req.params.id,
        creator: req.user,
    });
    if (!existingEntry) {
        return res.status(403).json({errors: [`You can't delete this id`]});
    }
    await DI.diaryEntryRepository.remove(existingEntry).flush();
    return res.status(204).send({});
});

router.put('/:id', async (req, res) => {
    try {
        const diaryEntry = await DI.diaryEntryRepository.findOne(req.params.id, {
            populate: ['tags'],
        });

        if (!diaryEntry) {
            return res.status(404).send({message: 'DiaryEntry not found'});
        }

        wrap(diaryEntry).assign(req.body);
        await DI.diaryEntryRepository.flush();

        res.json(diaryEntry);
    } catch (e: any) {
        return res.status(400).send({errors: [e.message]});
    }
});

export const DiaryController = router;
