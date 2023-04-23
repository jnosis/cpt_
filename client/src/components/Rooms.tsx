import useRooms from '../hooks/useRooms';
import RoomCard from './RoomCard';

export default function Rooms() {
  const { roomsQuery: { data: rooms } } = useRooms();
  return (
    <section className='flex flex-col justify-center items-center w-full'>
      <h1 className='text-5xl text-slate-800 font-bold py-6'>Rooms</h1>
      <ul className='flex flex-col items-center gap-2 w-2/3 p-10 rounded-3xl bg-slate-200'>
        {rooms && rooms.map((room) => <RoomCard key={room.id} room={room} />)}
      </ul>
      {/* TODO: Add Create Room */}
    </section>
  );
}
