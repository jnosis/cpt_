import type { NextFunction, OpineRequest, OpineResponse } from 'opine';
import { roomRepository } from '~/model/room.ts';
import { throwError } from '~/middleware/error_handler.ts';

const AUTH_ERROR = {
  status: 401,
  message: 'Authorization Error',
};

export const isInRoom = async (
  req: OpineRequest,
  _res: OpineResponse,
  next: NextFunction,
) => {
  const { method, originalUrl } = req;
  const roomId = req.params.id;
  const userId = req.body.userId;

  if (!roomId) {
    return throwError({
      method,
      baseUrl: originalUrl,
      ...AUTH_ERROR,
    });
  }
  const room = await roomRepository.findById(roomId);
  if (!room) {
    return throwError({
      method,
      baseUrl: originalUrl,
      status: 404,
      message: `Room id(${roomId}) not found`,
    });
  }
  if (!room.users.map((users) => users.id).includes(userId)) {
    return throwError({
      method,
      baseUrl: originalUrl,
      ...AUTH_ERROR,
    });
  }
  if (!req.body.users) req.body.users = [...room.users];
  next();
};
