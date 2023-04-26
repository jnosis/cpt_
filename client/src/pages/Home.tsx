import { Helmet } from 'react-helmet-async';
import About from '~/components/About';
import Rooms from '~/components/Rooms';
import { useAuthContext } from '~/contexts/AuthContext';

export default function Home() {
  const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title>CPT</title>
      </Helmet>
      {user ? <Rooms /> : <About />}
    </>
  );
}
