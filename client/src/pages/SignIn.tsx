import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginInfo, Validation } from '../types';
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
    <section>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type='text'
            name='username'
            value={loginInfo.username ?? ''}
            placeholder='username'
            required
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type='password'
            name='password'
            value={loginInfo.password ?? ''}
            placeholder='password'
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <button type='submit'>Sign in</button>
        </div>
      </form>
    </section>
  );
}
