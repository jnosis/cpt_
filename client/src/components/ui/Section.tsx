import React from 'react';

type SectionProps = React.PropsWithChildren & {
  className?: string;
};

export default function Section({ children, className }: SectionProps) {
  return (
    <section
      className={`flex flex-col justify-center items-center ${className}`}
    >
      {children}
    </section>
  );
}
