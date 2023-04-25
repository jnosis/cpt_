import { useNavigate } from 'react-router-dom';
import Action from '~/components/ui/Action';
import ArticleCard from '~/components/ui/ArticleCard';
import Section from '~/components/ui/Section';
import NoRoomCard from '~/components/NoRoomCard';
import RoomCard from '~/components/RoomCard';
import useRooms from '~/hooks/useRooms';

export default function Rooms() {
  const { roomsQuery: { data: rooms } } = useRooms();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/room/create');
  };

  return (
    <Section className='px-[5vw]'>
      <h1 className='text-5xl text-slate-800 font-bold py-6'>Rooms</h1>
      <ArticleCard className='relative w-full max-w-xl p-10'>
        <ul className='flex flex-col gap-2 w-full mb-4'>
          {!rooms?.length
            ? <NoRoomCard />
            : rooms.map((room) => <RoomCard key={room.id} room={room} />)}
        </ul>
        <div className='absolute bottom-2 right-3'>
          <Action
            actionType='button'
            title='Create'
            isDisable={false}
            onClick={handleClick}
          />
        </div>
      </ArticleCard>
    </Section>
  );
}
