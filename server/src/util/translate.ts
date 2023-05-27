import type { ChatData, RoomData } from '~/types.ts';
import openAi from '~/openai.ts';

async function translateChat(
  language: string,
  chat: ChatData,
): Promise<ChatData> {
  const { choices } = await openAi.translate(language, chat.message);
  const { text: message } = choices[0];

  return {
    ...chat,
    message,
  };
}

function translateChats(
  language: string,
  userId: string,
  chats: ChatData[],
): Promise<ChatData[]> {
  return Promise.all(
    chats.map(async (chat) =>
      chat.userId !== userId ? await translateChat(language, chat) : chat
    ),
  );
}

export async function translateRoom(
  language: string,
  userId: string,
  room: RoomData,
): Promise<RoomData> {
  return {
    ...room,
    chats: await translateChats(language, userId, room.chats),
  };
}

export function translateRooms(
  language: string,
  userId: string,
  rooms: RoomData[],
): Promise<RoomData[]> {
  return Promise.all(
    rooms.map(async (room) => await translateRoom(language, userId, room)),
  );
}
