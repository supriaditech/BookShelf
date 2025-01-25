import Head from 'next/head';
import Footer from './Footer';
import Navbar from './Navbar';

interface MasterLayoutProps {
  children: React.ReactNode;
}

const MasterLayout = ({ children }: MasterLayoutProps) => {
  return (
    <>
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default MasterLayout;
