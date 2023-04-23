import React from 'react';

type ArticleCardProps = React.PropsWithChildren & {
  className?: string;
};

export default function ArticleCard({ children, className }: ArticleCardProps) {
  return (
    <article
      className={`rounded-3xl bg-slate-200${className ? ` ${className}` : ''}`}
    >
      {children}
    </article>
  );
}
