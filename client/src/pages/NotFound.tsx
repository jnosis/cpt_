import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <h1>Not Found</h1>
      <Link to='/'>Go To Home</Link>
    </section>
  );
}
