'use client'; // Pastikan ini ada di bagian atas

import { ThemeProvider } from '@material-tailwind/react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

type ThemeProviderProps = {
  session: Session | null;
  children: ReactNode; // Menentukan tipe untuk children
};

export const ThemeProviderNext = ({
  session,
  children,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <SessionProvider session={session}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ToastContainer
          theme="colored"
          transition={Slide}
          position="top-center"
        />

        <ThemeProvider>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </SessionProvider>
  );
};
