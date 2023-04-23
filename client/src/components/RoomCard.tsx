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
    navigate(`/room/${id}`);
  };

  return (
    <li
      className='flex flex-col gap-1 w-full px-4 py-3 rounded-xl bg-slate-300'
      onClick={handleClick}
    >
      <header className='flex justify-between'>
        <h3 className='font-semibold text-slate-700'>{title}</h3>
        <span className='text-slate-700'>
          {users.map((user) => user.username).join(', ')}
        </span>
      </header>
      <span className='text-slate-600'>{getLastChat(chats)}</span>
    </li>
  );
}

function getLastChat(chats?: ChatInfo[]) {
  const lastChat = (chats ?? []).at(-1);
  return lastChat?.message ?? 'No message';
}
