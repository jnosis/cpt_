import Rooms from '~/components/Rooms';
import { useAuthContext } from '~/contexts/AuthContext';

export default function Home() {
  const { user } = useAuthContext();
  return user ? <Rooms /> : <>Home</>;
}
