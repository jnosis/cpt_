import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import User from './User';

export function Header() {
  const { user, logout } = useAuthContext();

  return (
    <header className='flex justify-between items-center p-2'>
      <Link to='/'>
        <h1>CPT</h1>
      </Link>
      {/* TODO: Make Button Component */}
      <nav className='flex gap-4'>
        {user && <User user={user} />}
        {!user ? (
          <>
            <Link to='/signin'>Sign in</Link>
            <Link to='/signup'>Sign up</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </nav>
    </header>
  );
}
