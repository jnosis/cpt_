import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RoomCreateInfo, UserInfo, Validation } from '../types';
import { useAuthContext } from '../contexts/AuthContext';
import useRooms from '../hooks/useRooms';
import { validateRoom } from '../utils/validator';

type RoomInfoValidation = Validation<RoomCreateInfo>;

const initialRoomCreateInfo: RoomCreateInfo = {
  title: '',
  users: [],
};

export default function CreateRoom() {
  const { createRoom } = useRooms();
  const { user, getList } = useAuthContext();

  const [users, setUsers] = useState<Omit<UserInfo, 'password'>[]>([]);
  const [roomCreateInfo, setRoomCreateInfo] = useState<RoomCreateInfo>(
    initialRoomCreateInfo,
  );
  const [validation, setValidation] = useState<RoomInfoValidation>({
    title: false,
    users: false,
  });

  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValidation((validation) => ({
      ...validation,
      'title': validateRoom('title', value),
    }));
    setRoomCreateInfo((roomCreateInfo) => ({
      ...roomCreateInfo,
      'title': value,
    }));
  };

  const handleUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    const found = users.filter((user) => user.id === value);
    const updated = checked
      ? [...roomCreateInfo.users, ...found]
      : [...roomCreateInfo.users.filter((user) => user.id !== value)];
    setValidation((validation) => ({
      ...validation,
      'users': validateRoom('users', updated),
    }));
    setRoomCreateInfo((roomCreateInfo) => ({
      ...roomCreateInfo,
      'users': [...updated],
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Object.values(validation).includes(false)) {
      createRoom.mutate(roomCreateInfo);
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    getList().then((users) => {
      setRoomCreateInfo((roomCreateInfo) => ({
        ...roomCreateInfo,
        users: [...users.filter((u) => u.id === user?.userId)],
      }));
      setUsers([...users.filter((u) => u.id !== user?.userId)]);
    });
  }, [user]);

  return (
    <>
      <h1>Create Room</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type='text'
            name='title'
            value={roomCreateInfo.title ?? ''}
            placeholder='title'
            required
            onChange={handleTitleChange}
          />
        </div>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <label>{user.username}</label>
              <input
                type='checkbox'
                name='users'
                value={user.id}
                onChange={handleUsersChange}
              />
            </li>
          ))}
        </ul>
        <div>
          <button type='submit'>Create</button>
        </div>
      </form>
    </>
  );
}
