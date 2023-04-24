import type { AuthToken } from '~/types';

type UserProps = {
  user: Omit<AuthToken, 'token'>;
};

export default function User({ user }: UserProps) {
  return (
    <div
      className='w-10 h-10 inline-flex items-center justify-center rounded-full font-medium text-slate-700'
      style={{ backgroundColor: stringToColor(user.userId) }}
    >
      {user.username[0].toUpperCase()}
    </div>
  );
}

function stringToColor(str: string) {
  let hash = str.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);

  return [0, 1, 2].reduce((color, i) => {
    return color + ('00' + ((hash >> (i * 8)) & 0xFF).toString(16)).slice(-2);
  }, '#');
}
