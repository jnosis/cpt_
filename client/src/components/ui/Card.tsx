import React from 'react';

type CardProps = React.PropsWithChildren & {
  onClick?: React.MouseEventHandler<HTMLLIElement>;
};

export default function Card({ children, onClick }: CardProps) {
  return (
    <li
      className={`flex flex-col gap-1 w-full px-4 py-3 rounded-xl bg-slate-300${
        onClick ? ' cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </li>
  );
}
