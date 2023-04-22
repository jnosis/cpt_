import React from 'react';

type ActionProps = {
  actionType: 'submit' | 'reset' | 'button';
  title: string;
  isDisable: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Action(
  { actionType, title, isDisable, onClick }: ActionProps,
) {
  return (
    <button
      className={`font-medium rounded-3xl px-3 py-2 ${
        isDisable
          ? 'text-slate-400 cursor-not-allowed'
          : 'text-slate-600 hover:bg-slate-400'
      }`}
      type={actionType}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
