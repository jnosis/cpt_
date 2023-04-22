import React from 'react';
import Action from './Action';
import { Validation } from '../../types';

type FormFieldProps<Type> = {
  title: string;
  data: Type;
  validation: Validation<Type>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function FormField<Type extends Record<string, string>>(
  { title, data, validation, onSubmit, onChange }: FormFieldProps<Type>,
) {
  return (
    <form
      className='relative flex justify-center w-80 px-6 py-10 rounded-3xl bg-slate-200'
      onSubmit={onSubmit}
    >
      <ul className='flex flex-col w-11/12 gap-1 mb-6'>
        {Object.keys(data).map((name, index) => (
          <li key={index}>
            <label
              className={`text-sm font-bold ${
                validation[name] ? 'text-slate-600' : 'text-red-500'
              }`}
            >
              {name}
            </label>
            <input
              className={`w-full rounded-sm bg-inherit outline outline-2 ${
                validation[name] ? 'outline-slate-600' : 'outline-red-600'
              }`}
              type={name === 'password'
                ? 'password'
                : name === 'email'
                ? 'email'
                : 'text'}
              name={name}
              value={data[name] ?? ''}
              placeholder={name}
              required
              onChange={onChange}
            />
          </li>
        ))}
      </ul>
      <div className='absolute bottom-2 right-3'>
        <Action
          actionType='submit'
          title={title}
          isDisable={Object.values(validation).includes(false)}
        />
      </div>
    </form>
  );
}
