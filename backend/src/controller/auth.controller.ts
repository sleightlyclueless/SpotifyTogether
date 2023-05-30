import { Router } from 'express';

import { DI } from '../';
import { LoginSchema, RegisterUserDTO, RegisterUserSchema, User } from '../entities';
import { Auth } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.post('/register', async (req, res) => {
  const validatedData = await RegisterUserSchema.validate(req.body).catch((e) => {
    res.status(400).send({ errors: e.errors });
  });
  if (!validatedData) {
    return;
  }
  const registerUserDto: RegisterUserDTO = {
    ...validatedData,
    password: await Auth.hashPassword(validatedData.password),
  };
  const existingUser = await DI.userRepository.findOne({
    email: validatedData.email,
  });
  if (existingUser) {
    return res.status(400).send({ errors: ['User already exists'] });
  }

  const newUser = new User(registerUserDto);
  await DI.userRepository.persistAndFlush(newUser);

  return res.status(201).send(newUser);
});

router.post('/login', async (req, res) => {
  console.log(req.body);
  const validatedData = await LoginSchema.validate(req.body).catch((e) => {
    res.status(400).send({ errors: e.errors });
  });
  if (!validatedData) {
    return;
  }

  const user = await DI.userRepository.findOne({
    email: validatedData.email,
  });
  if (!user) {
    return res.status(400).json({ errors: ['User does not exist'] });
  }
  const matchingPassword = await Auth.comparePasswordWithHash(validatedData.password, user.password);
  if (!matchingPassword) {
    return res.status(401).send({ errors: ['Incorrect password'] });
  }

  const jwt = Auth.generateToken({
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
  });

  res.status(200).send({ accessToken: jwt });
});

export const AuthController = router;
