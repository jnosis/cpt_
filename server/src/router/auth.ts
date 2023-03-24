import { Router } from 'opine';
import { z } from 'zod';
import type { IUserController } from '~/types.ts';
import { isAuth } from '~/middleware/auth.ts';
import { validate } from '~/middleware/validator.ts';

const router = Router();

const validateCredential = validate({
  username: z.string().min(1, { message: 'Username should be not empty' }),
  password: z.string().min(1, { message: 'Password should be not empty' }),
});

const validateSignup = [
  ...validateCredential,
  ...validate({
    email: z.string().email('Invalid email'),
  }),
];

export default function authRouter(userController: IUserController) {
  router.get('/list', userController.getList);
  router.post('/signup', validateSignup, userController.signup);
  router.post('/login', validateCredential, userController.login);
  router.post('/logout', userController.logout);
  router.get('/me', isAuth, userController.me);

  return router;
}
