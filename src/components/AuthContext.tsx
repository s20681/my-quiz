import React, { createContext, useState } from 'react';

interface UserData {
  login: string;
  id: string;
}

interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode; // Define the children prop
}

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
