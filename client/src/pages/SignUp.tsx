import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SignUpInfo, Validation } from '../types';
import { useAuthContext } from '../contexts/AuthContext';
import { validateUser } from '../utils/validator';

type SignUpInfoValidation = Validation<SignUpInfo>;

const initialUserInfo: SignUpInfo = {
  username: '',
  password: '',
  email: '',
};

export default function SignUp() {
  const { user, signup } = useAuthContext();

  const [userInfo, setUserInfo] = useState<SignUpInfo>(initialUserInfo);
  const [validation, setValidation] = useState<SignUpInfoValidation>({
    username: false,
    password: false,
    email: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValidation((validation) => ({
      ...validation,
      [name]: validateUser(name as keyof SignUpInfo, value),
    }));
    setUserInfo((userInfo) => ({ ...userInfo, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Object.values(validation).includes(false)) {
      signup(userInfo);
      navigate('/signin');
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user]);

  return (
    <section className='flex flex-col justify-center items-center w-full mt-16'>
      <h1 className='text-5xl text-slate-800 font-bold py-6'>Sign Up</h1>
      <form
        className='relative flex justify-center w-80 px-6 py-10 rounded-3xl bg-slate-200'
        onSubmit={handleSubmit}
      >
        <ul className='flex flex-col w-11/12 gap-1 mb-6'>
          <li>
            <label
              className={`text-sm font-bold ${
                validation.username ? 'text-slate-600' : 'text-red-500'
              }`}
            >
              Username
            </label>
            <input
              className={`w-full rounded-sm bg-inherit outline outline-2 ${
                validation.username ? 'outline-slate-600' : 'outline-red-600'
              }`}
              type='text'
              name='username'
              value={userInfo.username ?? ''}
              placeholder='username'
              required
              onChange={handleChange}
            />
          </li>
          <li>
            <label
              className={`text-sm font-bold ${
                validation.password ? 'text-slate-600' : 'text-red-500'
              }`}
            >
              Password
            </label>
            <input
              className={`w-full rounded-sm bg-inherit outline outline-2 ${
                validation.password ? 'outline-slate-600' : 'outline-red-600'
              }`}
              type='password'
              name='password'
              value={userInfo.password ?? ''}
              placeholder='password'
              required
              onChange={handleChange}
            />
          </li>
          <li>
            <label
              className={`text-sm font-bold ${
                validation.email ? 'text-slate-600' : 'text-red-500'
              }`}
            >
              Email
            </label>
            <input
              className={`w-full rounded-sm bg-inherit outline outline-2 ${
                validation.email ? 'outline-slate-600' : 'outline-red-600'
              }`}
              type='email'
              name='email'
              value={userInfo.email ?? ''}
              placeholder='email'
              required
              pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
              onChange={handleChange}
            />
          </li>
        </ul>
        <button
          className={`absolute font-medium bottom-2 right-3 rounded-3xl px-3 py-2 ${
            Object.values(validation).includes(false)
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-slate-600 hover:bg-slate-400'
          }`}
          type='submit'
        >
          Sign Up
        </button>
      </form>
    </section>
  );
}
