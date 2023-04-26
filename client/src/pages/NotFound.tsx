import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '~/components/Header';
import Section from '~/components/ui/Section';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Not Found | CPT</title>
      </Helmet>
      <Header />
      <Section>
        <h1 className='text-5xl text-slate-800 font-bold py-6'>Not Found</h1>
        <Link to='/'>Go To Home</Link>
      </Section>
    </>
  );
}
