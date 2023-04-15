import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuthContext();

  return (
    <header className='flex justify-between items-center p-2'>
      <Link to='/'>
        <h1>CPT</h1>
      </Link>
      {/* TODO: Make User and Button Components */}
      <nav className='flex gap-4'>
        {user && <div>{user.username[0].toUpperCase()}</div>}
        {!user
          ? (
            <>
              <Link to='/signin'>Sign in</Link>
              <Link to='/signup'>Sign up</Link>
            </>
          )
          : <button onClick={logout}>Logout</button>}
      </nav>
    </header>
  );
}
