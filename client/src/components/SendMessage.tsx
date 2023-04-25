import React, { useState } from 'react';
import Action from '~/components/ui/Action';

type SendMessageProps = {
  onSend(message: string): void;
};

export default function SendMessage({ onSend }: SendMessageProps) {
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form
      className='flex w-full max-w-xl mt-2 px-4 py-2 rounded-full bg-slate-200'
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <input
        className='flex-auto px-3 py-2 focus:outline-none bg-inherit'
        type='text'
        name='message'
        value={message ?? ''}
        placeholder='input message'
        onChange={handleChange}
      />
      <Action actionType='submit' title='send' isDisable={!message.length} />
    </form>
  );
}
