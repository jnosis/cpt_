import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className='flex justify-between items-center p-2'>
      <Link to='/'>
        <h1>CPT</h1>
      </Link>
      {/* TODO: Make User and Button Components */}
      <nav className='flex gap-4'>
        <div>USER</div>
        <button>Login|Logout</button>
      </nav>
    </header>
  );
}
