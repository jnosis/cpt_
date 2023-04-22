import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginInfo, Validation } from '../types';
import FormField from '../components/ui/FormField';
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
      <FormField
        title='Sign In'
        data={loginInfo}
        validation={validation}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </section>
  );
}
