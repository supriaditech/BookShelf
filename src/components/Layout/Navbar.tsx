'use client';
import { useTheme } from '@/context/ThemeContext';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LocaleSwitcher';
import useAuth from '@/hooks/useAuth';
import Image from 'next/image';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdNightlight, MdOutlineNightlight } from 'react-icons/md';

// import DrawerNavbarMobile from './DrawerNavbarMobile';
import React from 'react';
import DrawerNavbar from './DrawerNavbar';
import { Typography } from '@material-tailwind/react';
interface NavbarProps {
  session: any;
  locale: string;
}
const Navbar = ({ session, locale }: NavbarProps) => {
  const { handleLogout } = useAuth(locale);
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  console.log(theme);
  return (
    <nav
      className={`blok top-0 w-screen p-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } text-${theme === 'dark' ? 'white' : 'black'} shadow`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href="/">
            <Image
              src="/images/logo/logo.png"
              width={120}
              height={20}
              className="w-28 sm:w-40 h-auto "
              alt="Logo"
            />
          </Link>
        </div>

        {/* desktop */}
        <div className="hidden md:flex flex-row justify-between items-center  w-full ">
          {session ? (
            <ul className="flex space-x-20 w-full justify-center">
              <li>
                <Link href="/home" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          ) : (
            <div className="w-full"></div>
          )}
          <LanguageSwitcher />
          <div className="flex flex-row gap-1 justify-items-end items-center">
            {!session && (
              <div className="flex flex-row gap-2 items-center">
                <Link href={'/login'}>
                  <div
                    className={`p-1 rounded w-24 flex flex-col justify-center items-center ${
                      theme === 'dark'
                        ? 'bg-white text-gray-800 hover:bg-gray-500 hover:text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-200 hover:text-black'
                    }`}
                  >
                    Login
                  </div>
                </Link>

                <Link href={'/register'}>
                  <div
                    className={`p-1 rounded w-24 flex flex-col justify-center items-center ${
                      theme === 'dark'
                        ? 'bg-white text-gray-800 hover:bg-gray-500 hover:text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-200 hover:text-black'
                    }`}
                  >
                    Register
                  </div>
                </Link>
              </div>
            )}

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full flex flex-col justify-center items-center ${
                theme === 'dark'
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-800 text-white'
              }`}
            >
              {theme === 'light' ? <MdOutlineNightlight /> : <MdNightlight />}
            </button>
            {session && session?.user?.user && (
              <div className="-mt-1">
                <Typography variant="h5" className=" font-bold text-lg">
                  {session?.user?.user.name}
                </Typography>
                <Typography variant="h6" className=" font-light -mt-1 text-xs">
                  {session?.user?.user.email}
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* mobile */}
        <div className="flex flex-row gap-1 items-center sm:hidden">
          <LanguageSwitcher />
          {session != null ? (
            <div
              onClick={openDrawer}
              className={`p-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-white text-gray-800 hover:bg-gray-100'
                  : 'bg-gray-800 text-white hover:bg-gray-500'
              }`}
            >
              <GiHamburgerMenu />
            </div>
          ) : (
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full flex flex-col justify-center items-center ${
                theme === 'dark'
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-800 text-white'
              }`}
            >
              {theme === 'light' ? <MdOutlineNightlight /> : <MdNightlight />}
            </button>
          )}
          <DrawerNavbar
            session={session}
            type="mobile"
            open={open}
            openDrawer={openDrawer}
            closeDrawer={closeDrawer}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
