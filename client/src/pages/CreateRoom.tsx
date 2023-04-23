import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RoomCreateInfo, UserInfo, Validation } from '../types';
import Action from '../components/ui/Action';
import CheckBoxField from '../components/ui/CheckBoxField';
import TextInputField from '../components/ui/TextField';
import Section from '../components/ui/Section';
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
    <Section>
      <h1 className='text-5xl text-slate-800 font-bold py-6'>Create Room</h1>
      <form
        className='relative flex flex-col items-center w-80 px-6 py-10 rounded-3xl bg-slate-200'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col w-11/12'>
          <TextInputField
            name='title'
            data={roomCreateInfo.title}
            validation={validation.title}
            onChange={handleTitleChange}
          />
        </div>
        <div className='flex flex-col w-11/12 gap-1 mt-2 mb-1'>
          <h6
            className={`text-sm font-bold ${
              validation.users ? 'text-slate-600' : 'text-red-500'
            }`}
          >
            users
          </h6>
          <ul className='px-1'>
            {users.map((user) => (
              <li key={user.id}>
                <CheckBoxField
                  title={user.username}
                  name='users'
                  value={user.id}
                  onChange={handleUsersChange}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className='absolute bottom-2 right-3'>
          <Action
            actionType='submit'
            title='Create'
            isDisable={Object.values(validation).includes(false)}
          />
        </div>
      </form>
    </Section>
  );
}
