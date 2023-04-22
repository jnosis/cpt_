import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginInfo, Validation } from '../types';
import Action from '../components/ui/Action';
import { useAuthContext } from '../contexts/AuthContext';
import { validateUser } from '../utils/validator';

type LoginInfoValidation = Validation<LoginInfo>;

const initialLoginInfo: LoginInfo = {
  username: '',
  password: '',
};

export default function SignIn() {
  const { user, login } = useAuthContext();

  const [loginInfo, setLoginInfo] = useState<LoginInfo>(initialLoginInfo);
  const [validation, setValidation] = useState<LoginInfoValidation>({
    username: false,
    password: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValidation((validation) => ({
      ...validation,
      [name]: validateUser(name as keyof LoginInfo, value),
    }));
    setLoginInfo((loginInfo) => ({ ...loginInfo, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Object.values(validation).includes(false)) {
      login(loginInfo);
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    !!user && navigate('/');
  }, [user]);

  return (
    <section className='flex flex-col justify-center items-center w-full mt-16'>
      <h1 className='text-5xl text-slate-800 font-bold py-6'>Login</h1>
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
              value={loginInfo.username ?? ''}
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
              value={loginInfo.password ?? ''}
              placeholder='password'
              required
              onChange={handleChange}
            />
          </li>
        </ul>
        <div className='absolute bottom-2 right-3'>
          <Action
            actionType='submit'
            title='Sign in'
            isDisable={Object.values(validation).includes(false)}
          />
        </div>
      </form>
    </section>
  );
}
