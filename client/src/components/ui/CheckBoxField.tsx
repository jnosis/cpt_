import React from 'react';

type CheckBoxFieldProps = {
  title: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function CheckBoxField(
  { title, name, value, onChange }: CheckBoxFieldProps,
) {
  return (
    <>
      <input
        id={`checkbox-${value}`}
        type='checkbox'
        name={name}
        value={value}
        onChange={onChange}
      />
      <label
        className='text-sm text-slate-600 font-bold'
        htmlFor={`checkbox-${value}`}
      >
        {title}
      </label>
    </>
  );
}
