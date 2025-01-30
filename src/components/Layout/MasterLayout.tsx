import { getSession } from 'next-auth/react';
import Footer from './Footer';
import Navbar from './Navbar';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
interface MasterLayoutProps {
  children: React.ReactNode;
  locale: string;
}

const MasterLayout = async ({ children, locale }: MasterLayoutProps) => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className="relative flex flex-col min-h-screen">
        <Navbar session={session} locale={locale} />

        <main className="flex-grow w-full mx-auto">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default MasterLayout;
