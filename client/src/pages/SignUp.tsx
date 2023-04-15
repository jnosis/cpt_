import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SignUpInfo } from '../types';
import { useAuthContext } from '../contexts/AuthContext';
import { validateUser } from '../utils/validator';

type SignUpInfoValidation = {
  username: boolean;
  password: boolean;
  email: boolean;
};

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
      [name]: validateUser(name, value),
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
    <section>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type='text'
            name='username'
            value={userInfo.username ?? ''}
            placeholder='username'
            required
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type='password'
            name='password'
            value={userInfo.password ?? ''}
            placeholder='password'
            required
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            type='email'
            name='email'
            value={userInfo.email ?? ''}
            placeholder='email'
            required
            pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
            onChange={handleChange}
          />
        </div>
        <div>
          <button type='submit'>Sign Up</button>
        </div>
      </form>
    </section>
  );
}
