import { useNavigate, useParams } from 'react-router-dom';
import ChatList from '../components/ChatList';
import { useAuthContext } from '../contexts/AuthContext';
import useRooms from '../hooks/useRooms';

export default function Room() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { roomQuery, sendMessage } = useRooms();
  const { data: room } = roomQuery(id || '');

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleSendMessage = (message: string) => {
    sendMessage.mutate({ roomId: id ?? '', message });
  };

  return (
    <>
      {room && (
        <>
          <header>
            <h2>{room.title}</h2>
            <button onClick={handleBack}>Back</button>
          </header>
          <ChatList
            userId={user?.userId ?? ''}
            room={room}
            onSend={handleSendMessage}
          />
        </>
      )}
    </>
  );
}
