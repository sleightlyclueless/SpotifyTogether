import { object, string } from 'yup';

import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from './BaseEntity';
import { DiaryEntry, DiaryEntryTag } from './index';

@Entity()
export class User extends BaseEntity {
  @Property()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @OneToMany(() => DiaryEntry, (e) => e.creator)
  diaryEntries = new Collection<DiaryEntry>(this);

  @OneToMany(() => DiaryEntryTag, (e) => e.creator)
  tags = new Collection<DiaryEntryTag>(this);

  constructor({ lastName, firstName, email, password }: RegisterUserDTO) {
    super();
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export const RegisterUserSchema = object({
  email: string().required(),
  password: string().required(),
  firstName: string().required(),
  lastName: string().required(),
});

export type RegisterUserDTO = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const LoginSchema = object({
  email: string().required(),
  password: string().required(),
});
