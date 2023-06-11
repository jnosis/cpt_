import type {
  ChatInfo,
  IHttpClient,
  IRoomApi,
  RoomCreateInfo,
  RoomInfo,
} from '~/types';

export default class RoomApi implements IRoomApi {
  #http: IHttpClient;
  #translate: boolean;
  constructor(http: IHttpClient, translate: boolean = false) {
    this.#http = http;
    this.#translate = translate;
  }

  async getList(): Promise<RoomInfo[]> {
    return await this.#http.fetch<RoomInfo[]>(
      `/api/room${this.#translate ? '?translate=true' : ''}`,
      { method: 'GET' },
    );
  }

  async getRoom(roomId: string): Promise<RoomInfo | null> {
    return await this.#http.fetch<RoomInfo | null>(
      `/api/room/${roomId}${this.#translate ? '?translate=true' : ''}`,
      { method: 'GET' },
    );
  }

  async create(room: RoomCreateInfo): Promise<RoomInfo> {
    return await this.#http.fetch<RoomInfo>('/api/room', {
      method: 'POST',
      body: JSON.stringify(room),
    });
  }

  async update(roomId: string, updated: RoomCreateInfo): Promise<RoomInfo> {
    return await this.#http.fetch<RoomInfo>(`/api/room/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(updated),
    });
  }

  async remove(roomId: string): Promise<string> {
    await this.#http.fetch<void>(`/api/room/${roomId}`, {
      method: 'DELETE',
    });
    return roomId;
  }

  async sendChat(roomId: string, message: string): Promise<ChatInfo> {
    return await this.#http.fetch<ChatInfo>(`/api/room/${roomId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  toggleTranslate(): boolean {
    this.#translate = !this.#translate;
    localStorage.setItem('translate', this.#translate);
    return this.#translate;
  }
}
