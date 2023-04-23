import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import User from './User';

export function Header() {
  const { user, logout } = useAuthContext();

  return (
    <header className='flex justify-between items-center h-16 px-4 py-2 bg-slate-200'>
      <Link to='/'>
        <h1 className='text-xl font-bold text-slate-800'>CPT</h1>
      </Link>
      <nav className='flex gap-4'>
        {user && <User user={user} />}
        {!user
          ? (
            <>
              <Link
                className='rounded-lg px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-400'
                to='/signin'
              >
                Sign in
              </Link>
              <Link
                className='rounded-lg px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-400'
                to='/signup'
              >
                Sign up
              </Link>
            </>
          )
          : (
            <button
              className='rounded-lg px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-400'
              onClick={logout}
            >
              Logout
            </button>
          )}
      </nav>
    </header>
  );
}
