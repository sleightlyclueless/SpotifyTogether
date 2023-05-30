import { object, string } from 'yup';

import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';
import { DiaryEntryTag } from './index';
import { User } from './User';

@Entity()
export class DiaryEntry extends BaseEntity {
  @Property()
  title: string;

  @Property()
  content: string;

  @ManyToMany(() => DiaryEntryTag)
  tags = new Collection<DiaryEntryTag>(this);

  @ManyToOne(() => User, { nullable: true, cascade: [] })
  creator?: User;

  constructor({ title, content, creator }: CreateDiaryEntryDTO) {
    super();
    this.title = title;
    this.content = content;
    this.creator = creator;
  }
}

export const CreateDiaryEntrySchema = object({
  title: string().required(),
  content: string().required(),
});

export type CreateDiaryEntryDTOTag = Partial<Pick<DiaryEntryTag, 'id' | 'name' | 'creator'>>;
export type CreateDiaryEntryDTO = {
  content: string;
  creator: User;
  tags?: CreateDiaryEntryDTOTag[];
  title: string;
};
