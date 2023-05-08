import React from 'react';

type CardProps = React.PropsWithChildren & {
  onClick?: React.MouseEventHandler<HTMLLIElement>;
};

export default function Card({ children, onClick }: CardProps) {
  return (
    <li
      className={`group flex flex-col gap-1 w-full px-4 py-3 rounded-xl bg-slate-300${
        onClick ? ' cursor-pointer hover:bg-gray-300' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </li>
  );
}
