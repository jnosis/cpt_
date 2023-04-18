import { useNavigate } from 'react-router-dom';
import type { ChatInfo, RoomInfo } from '../types';

type RoomCardProps = {
  room: RoomInfo;
};

export default function RoomCard(
  { room: { id, title, users, chats } }: RoomCardProps,
) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(id);
    navigate(`/room/${id}`);
  };

  return (
    <li onClick={handleClick}>
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
