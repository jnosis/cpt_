import type { AuthToken } from '~/types';

type UserProps = {
  user: Omit<AuthToken, 'token'>;
};

export default function User({ user }: UserProps) {
  return (
    <>
      <div>{user.username[0].toUpperCase()}</div>
    </>
  );
}
