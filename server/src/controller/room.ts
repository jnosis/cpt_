import type { OpineRequest, OpineResponse } from 'opine';
import type {
  ChatData,
  IRoomController,
  RoomData,
  RoomModel,
  UserData,
} from '~/types.ts';
import { throwError } from '~/middleware/error_handler.ts';
import log from '~/util/logger.ts';
import { convertToMessage } from '~/util/message.ts';

export class RoomController implements IRoomController {
  #roomRepository: RoomModel;
  #sseResponses: Record<string, OpineResponse>;
  constructor(roomRepository: RoomModel) {
    this.#roomRepository = roomRepository;
    this.#sseResponses = {};
  }

  getList = async (req: OpineRequest, res: OpineResponse<RoomData[]>) => {
    const { method, baseUrl } = req;
    const userId = req.body.userId;
    const rooms = await this.#roomRepository.getAll(userId);

    const msg = convertToMessage({
      method,
      baseUrl,
      status: 200,
      message: `by user(${userId})`,
    });
    log.debug(msg);
    res.setStatus(200).json(rooms);
  };

  getById = async (req: OpineRequest, res: OpineResponse<RoomData>) => {
    const { method, baseUrl } = req;
    const id = req.params.id;
    const { userId } = req.body;
    const room = await this.#roomRepository.findById(id);

    if (!room) {
      return throwError({
        method,
        baseUrl,
        status: 404,
        message: `Room id(${id}) not found`,
      });
    }

    const msg = convertToMessage({
      method,
      baseUrl,
      param: id,
      status: 200,
      message: `by user(${userId})`,
    });
    log.debug(msg);
    res.setStatus(200).json(room);
  };

  create = async (req: OpineRequest, res: OpineResponse<RoomData>) => {
    const { method, baseUrl } = req;
    const { title, users, userId } = req.body;
    const room = await this.#roomRepository.create({ title, users });

    const msg = convertToMessage({
      method,
      baseUrl,
      status: 201,
      message: `room(${room?.id}) is created`,
    });
    log.debug(msg);
    room?.users.filter((user) => user.id !== userId).forEach((user) =>
      this.#emitServerSentEvent(user.id, 'create', room.id)
    );
    res.setStatus(201).json(room);
  };

  update = async (req: OpineRequest, res: OpineResponse<RoomData>) => {
    const { method, baseUrl } = req;
    const id = req.params.id;
    const { title, users, userId } = req.body;
    const room = await this.#roomRepository.findById(id);

    if (!room) {
      return throwError({
        method,
        baseUrl,
        param: id,
        status: 404,
        message: `Room id(${id}) not found`,
      });
    }

    const updated = await this.#roomRepository.update(id, { title, users });
    const msg = convertToMessage({
      method,
      baseUrl,
      param: id,
      status: 200,
      message: `by user(${userId})`,
    });
    log.debug(msg);
    room.users.filter((user) => user.id !== userId).forEach((user) =>
      this.#emitServerSentEvent(user.id, 'update', id)
    );
    return res.setStatus(200).json(updated);
  };

  delete = async (req: OpineRequest, res: OpineResponse) => {
    const { method, baseUrl } = req;
    const { userId } = req.body;
    const id = req.params.id;
    const room = await this.#roomRepository.findById(id);

    if (!room) {
      return throwError({
        method,
        baseUrl,
        param: id,
        status: 404,
        message: `Room id(${id}) not found`,
      });
    }

    await this.#roomRepository.remove(id);
    const msg = convertToMessage({
      method,
      baseUrl,
      param: id,
      status: 204,
      message: `by user(${userId})`,
    });
    log.debug(msg);
    room.users.filter((user) => user.id !== userId).forEach((user) =>
      this.#emitServerSentEvent(user.id, 'delete', id)
    );
    return res.setStatus(204).end();
  };

  send = async (req: OpineRequest, res: OpineResponse<ChatData>) => {
    const { method, baseUrl } = req;
    const roomId = req.params.id;
    const { userId, username, users, chat } = req.body;
    const sent = await this.#roomRepository.send(
      roomId,
      userId,
      username,
      chat,
    );

    const msg = convertToMessage({
      method,
      baseUrl,
      param: roomId,
      status: 201,
      message: `by user(${userId})`,
    });
    log.debug(msg);
    (users as UserData[]).filter((user) => user.id !== userId).forEach((user) =>
      this.#emitServerSentEvent(user.id, 'send', roomId)
    );
    res.setStatus(201).json(sent);
  };

  connect = (req: OpineRequest, res: OpineResponse) => {
    const { method, originalUrl } = req;
    const id = req.body.userId;

    const msg = convertToMessage({
      method,
      baseUrl: originalUrl,
      status: 200,
      message: `user(${id}) is connected...`,
    });
    log.info(msg);
    res
      .setHeader('Content-Type', 'text/event-stream')
      .setHeader('Cache-Control', 'no-cache')
      .setHeader('Connection', 'keep-alive');
    this.#sseResponses[id] = res;
  };

  #emitServerSentEvent(userId: string, type: string, roomId: string) {
    log.info(convertToMessage({
      method: 'SSE',
      baseUrl: `/api/connect/${userId}`,
      status: 200,
      message: `${type.toUpperCase()} ${roomId}`,
    }));
    this.#sseResponses[userId]?.setStatus(200).send(
      `event:${type}\ndata:${roomId}\n\n`,
    );
  }
}
