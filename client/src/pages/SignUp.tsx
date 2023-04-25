import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SignUpInfo, Validation } from '~/types';
import FormField from '~/components/ui/FormField';
import Section from '~/components/ui/Section';
import { useAuthContext } from '~/contexts/AuthContext';
import { validateUser } from '~/utils/validator';

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
    <Section className='px-4'>
      <h1 className='text-5xl text-slate-800 font-bold py-6'>Sign Up</h1>
      <FormField
        title='Sign Up'
        data={userInfo}
        validation={validation}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </Section>
  );
}
