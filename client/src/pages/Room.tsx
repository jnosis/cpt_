import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useRooms from '../hooks/useRooms';

export default function Room() {
  const { id } = useParams();
  const { roomQuery, sendMessage } = useRooms();
  const { data: room } = roomQuery(id || '');

  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage.mutate({ roomId: id ?? '', message });
    setMessage('');
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
                <li key={chat.created_at}>{chat.message}</li>
              ))}
            </ul>
            <form onSubmit={handleSendMessage}>
              <input
                type='text'
                name='message'
                value={message ?? ''}
                placeholder='input message'
                onChange={handleChange}
              />
              <button type='submit'>send</button>
            </form>
          </section>
        </>
      )}
    </>
  );
}