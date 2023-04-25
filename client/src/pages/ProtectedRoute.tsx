import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '~/contexts/AuthContext';

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { user } = useAuthContext();

  if (user) {
    return <>{children}</>;
  }

  return <Navigate to='/' replace />;
}
