import { useNavigate, useParams } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import SendMessage from '../components/SendMessage';
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
          <section>
            <ul>
              {room.chats.map((chat) => (
                <ChatBubble
                  key={chat.created_at}
                  chat={chat}
                  isSender={user?.userId === chat.userId}
                />
              ))}
            </ul>
            <SendMessage onSend={handleSendMessage} />
          </section>
        </>
      )}
    </>
  );
}
