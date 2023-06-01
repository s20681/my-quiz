import React, { createContext, useState } from 'react';
import { AuthContextType, AuthProviderProps, UserData } from '../interfaces';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  const login = (userData: UserData) => {
    console.log(userData)
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
