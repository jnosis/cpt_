import { Outlet } from 'react-router-dom';
import AuthApi from './api/auth';
import { Header } from './components/Header';
import { AuthContextProvider } from './contexts/AuthContext';
import HttpClient from './networks/http';

const authApi = new AuthApi(new HttpClient(import.meta.env.VITE_SERVER_URL));

function App() {
  return (
    <AuthContextProvider authApi={authApi}>
      <Header />
      <Outlet />
    </AuthContextProvider>
  );
}

export default App;
