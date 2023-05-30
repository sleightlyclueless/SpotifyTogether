import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';
import { DiaryEntry } from './index';
import { User } from './User';

@Entity()
export class DiaryEntryTag extends BaseEntity {
  @Property()
  name: string;

  @ManyToMany(() => DiaryEntry, (e) => e.tags)
  diaryEntries = new Collection<DiaryEntry>(this);

  @ManyToOne(() => User, { nullable: true })
  creator?: User;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
