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

  getList = async (
    req: OpineRequest,
    res: OpineResponse<RoomData[]>,
  ) => {
    const { method, baseUrl } = req;
    const userId = req.body.userId;
    const rooms = await this.#roomRepository.getAll(userId);

    const msg = convertToMessage({
      method,
      baseUrl,
      status: 200,
    });
    log.debug(msg);
    res.setStatus(200).json(rooms);
  };

  getById = async (req: OpineRequest, res: OpineResponse<RoomData>) => {
    const { method, baseUrl } = req;
    const id = req.params.id;
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
    });
    log.debug(msg);
    res.setStatus(200).json(room);
  };

  create = async (req: OpineRequest, res: OpineResponse<RoomData>) => {
    const { method, baseUrl } = req;
    const { title, users } = req.body;
    const room = await this.#roomRepository.create({ title, users });

    const msg = convertToMessage({
      method,
      baseUrl,
      status: 201,
    });
    log.debug(msg);
    res.setStatus(201).json(room);
  };

  update = async (req: OpineRequest, res: OpineResponse<RoomData>) => {
    const { method, baseUrl } = req;
    const id = req.params.id;
    const { title, users } = req.body;
    const room = await this.#roomRepository.findById(id);

    if (!room) {
      throwError({
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
    });
    log.debug(msg);
    res.setStatus(200).json(updated);
  };

  delete = async (req: OpineRequest, res: OpineResponse) => {
    const { method, baseUrl } = req;
    const id = req.params.id;
    const room = await this.#roomRepository.findById(id);

    if (!room) {
      throwError({
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
    });
    log.debug(msg);
    res.setStatus(204).end();
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
    });
    log.debug(msg);
    (users as UserData[]).filter((user) => user.id !== userId).forEach((user) =>
      this.#sseResponses[user.id]?.setStatus(200).send(
        `event:send\ndata:{'id':'${roomId}'}\n\n`,
      )
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
}
