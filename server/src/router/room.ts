import { Router } from 'opine';
import { z } from 'zod';
import type { IRoomController } from '~/types.ts';
import { isAuth } from '~/middleware/auth.ts';
import { isInRoom } from '~/middleware/room.ts';
import { validate } from '~/middleware/validator.ts';

const router = Router();

const validateRoom = validate({
  title: z.string().min(1, { message: 'Title should be not empty' }),
  users: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email(),
  }).array().min(1, { message: 'Users should be at least one' }),
});

const validateChat = validate({
  message: z.string().min(1, { message: 'Message should be not empty' }),
});

export default function authRouter(roomController: IRoomController) {
  router.get('/', isAuth, roomController.getList);
  router.get('/:id', isAuth, isInRoom, roomController.getById);
  router.post('/', isAuth, validateRoom, roomController.create);
  router.post('/:id', isAuth, isInRoom, validateChat, roomController.send);
  router.put('/:id', isAuth, isInRoom, validateRoom, roomController.update);
  router.delete('/:id', isAuth, isInRoom, roomController.delete);

  return router;
}
