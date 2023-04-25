import { Link } from 'react-router-dom';
import { Header } from '~/components/Header';
import Section from '~/components/ui/Section';

export default function NotFound() {
  return (
    <>
      <Header />
      <Section>
        <h1 className='text-5xl text-slate-800 font-bold py-6'>Not Found</h1>
        <Link to='/'>Go To Home</Link>
      </Section>
    </>
  );
}
