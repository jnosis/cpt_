import React from 'react';
import type { Validation } from '~/types';
import Action from '~/components/ui/Action';
import TextInputField from '~/components/ui/TextField';

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
            <TextInputField
              name={name}
              data={data[name]}
              validation={validation[name]}
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
