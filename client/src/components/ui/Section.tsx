import React from 'react';

export default function Section({ children }: React.PropsWithChildren) {
  return (
    <section className='flex flex-col justify-center items-center w-full'>
      {children}
    </section>
  );
}
