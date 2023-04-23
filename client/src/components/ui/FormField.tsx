import React from 'react';
import type { Validation } from '~/types';
import Action from '~/components/ui/Action';
import ArticleCard from '~/components/ui/ArticleCard';
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
    <ArticleCard className='relative w-80 px-6 py-10'>
      <form className='flex justify-center w-full' onSubmit={onSubmit}>
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
    </ArticleCard>
  );
}
