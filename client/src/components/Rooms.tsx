import useRooms from '../hooks/useRooms';
import RoomCard from './RoomCard';

export default function Rooms() {
  const { roomsQuery: { data: rooms } } = useRooms();
  return (
    <>
      <h1>Rooms</h1>
      <ul>
        {rooms && rooms.map((room) => <RoomCard key={room.id} room={room} />)}
      </ul>
      {/* TODO: Add Create Room */}
    </>
  );
}
