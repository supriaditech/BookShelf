'use client';

import { useTheme } from '@/context/ThemeContext';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#00C9AC"
        options={{ showSpinner: false }}
        shallowRouting
        
      />
    </>
  );
};

export default Providers;
