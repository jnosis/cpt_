import { ChatInfo, RoomInfo } from '../types';

type RoomCardProps = {
  room: RoomInfo;
};

export default function RoomCard(
  { room: { title, users, chats } }: RoomCardProps,
) {
  return (
    <li>
      <h3>{title}</h3>
      <span>{users.map((user) => user.username).join(', ')}</span>
      <span>{getLastChat(chats)}</span>
    </li>
  );
}

function getLastChat(chats: ChatInfo[]) {
  const lastChat = chats.findLast((chat) => !!chat);
  return lastChat?.message ?? '';
}
