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
  themeDrawer: any;
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
  const themeDrawer = {
    drawer: {
      defaultProps: {
        size: 300,
        overlay: true,
        placement: 'left',
        overlayProps: undefined,
        className: '',
        dismiss: undefined,
        onClose: undefined,
        transition: {
          type: 'tween',
          duration: 0.3,
        },
      },
      styles: {
        base: {
          drawer: {
            position: 'fixed',
            zIndex: 'z-[9999]',
            pointerEvents: 'pointer-events-auto',
            backgroundColor: 'bg-white',
            boxSizing: 'box-border',
            width: 'w-full',
            boxShadow: 'shadow-2xl shadow-blue-gray-900/10',
          },
          overlay: {
            position: 'fixed',
            inset: 'inset-0',
            width: 'w-full',
            height: 'h-full',
            pointerEvents: 'pointer-events-auto',
            zIndex: 'z-[9995]',
            backgroundColor: 'bg-black',
            backgroundOpacity: 'bg-opacity-60',
            backdropBlur: 'backdrop-blur-sm',
          },
        },
      },
    },
  };
  return (
    <SessionProvider session={session}>
      <ThemeContext.Provider value={{ themeDrawer, theme, toggleTheme }}>
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
