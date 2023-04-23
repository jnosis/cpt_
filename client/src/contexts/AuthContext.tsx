import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  AuthToken,
  IAuthApi,
  LoginInfo,
  SignUpInfo,
  UserInfo,
} from '~/types';

type AuthContextType = {
  user: AuthToken | null;
  getList(): Promise<Omit<UserInfo, 'password'>[]>;
  signup(user: SignUpInfo): Promise<void>;
  login(loginInfo: LoginInfo): Promise<void>;
  logout(): Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  getList: () => Promise.resolve([]),
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
});

type AuthContextProps = PropsWithChildren & {
  authApi: IAuthApi;
};

export function AuthContextProvider({ authApi, children }: AuthContextProps) {
  const [user, setUser] = useState<AuthToken | null>(null);

  const handleToken = (token: AuthToken | null) => {
    if (token?.username !== user?.username) setUser(token);
  };

  useEffect(() => {
    authApi
      .me()
      .then((token) => {
        if (token) {
          handleToken(token);
        }
      })
      .catch(() => handleToken(null));
  }, [user]);

  const getList = useCallback(async () => {
    return await authApi.getList();
  }, []);

  const signup = useCallback(async (user: UserInfo) => {
    const token = await authApi.signup(user);
    setUser(token);
  }, []);

  const login = useCallback(async (loginInfo: LoginInfo) => {
    const token = await authApi.login(loginInfo);
    setUser(token);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const context = useMemo(
    () => ({ user, getList, signup, login, logout }),
    [user, getList, signup, login, logout],
  );

  return <AuthContext.Provider value={context}>{children}
  </AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
