import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='message'
        value={message ?? ''}
        placeholder='input message'
        onChange={handleChange}
      />
      <button type='submit'>send</button>
    </form>
  );
}
