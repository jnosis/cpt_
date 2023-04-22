import React from 'react';

type InputFieldProps = {
  name: string;
  data: string;
  validation: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function InputField(
  { name, data, validation, onChange }: InputFieldProps,
) {
  return (
    <>
      <label
        className={`text-sm font-bold ${
          validation ? 'text-slate-600' : 'text-red-500'
        }`}
      >
        {name}
      </label>
      <input
        className={`w-full rounded-sm bg-inherit outline outline-2 ${
          validation ? 'outline-slate-600' : 'outline-red-600'
        }`}
        type={name === 'password'
          ? 'password'
          : name === 'email'
          ? 'email'
          : 'text'}
        name={name}
        value={data ?? ''}
        placeholder={name}
        required
        onChange={onChange}
      />
    </>
  );
}
