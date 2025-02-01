'use client';
import { useTheme } from '@/context/ThemeContext';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LocaleSwitcher';
import useAuth from '@/hooks/useAuth';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdNightlight, MdOutlineNightlight } from 'react-icons/md';

// import DrawerNavbarMobile from './DrawerNavbarMobile';
import React from 'react';
import DrawerNavbar from './DrawerNavbar';
import { Typography } from '@material-tailwind/react';
import { FaUser } from 'react-icons/fa';
import { LoadingImage } from '../LazyLoading/LoadingImage';
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
  const [openProfile, setOpenProfile] = React.useState(false);

  const handleOpenProfile = () => {
    setOpenProfile(!openProfile);
  };
  return (
    <nav
      className={`sticky top-0 z-10  p-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } text-${theme === 'dark' ? 'white' : 'black'} shadow`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href="/">
            <LoadingImage
              src="/images/logo/logo.png"
              width={120}
              height={20}
              className="w-28 sm:w-40 h-auto object-fit"
              alt="Logo"
            />
          </Link>
        </div>

        {/* desktop */}
        <div className="hidden md:flex flex-row justify-between items-center  w-full ">
          {session ? (
            <ul className="flex space-x-20 w-full justify-center">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:underline">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:underline">
                  Book
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
              <div
                className="-mt-1 relative cursor-pointer"
                onClick={handleOpenProfile}
              >
                <Typography variant="h5" className=" font-bold text-lg">
                  {session?.user?.user.name}
                </Typography>
                <Typography variant="h6" className=" font-light -mt-1 text-xs">
                  {session?.user?.user.email}
                </Typography>
                {openProfile && (
                  <div
                    className={`absolute z-50${
                      theme === 'dark'
                        ? 'text-white bg-gray-800 border-gray-700'
                        : 'text-gray-600 bg-white border-gray-100'
                    } w-auto mt-5 shadow-sm border rounded-sm px-5 py-2 flex flex-col gap-2 -right-3 transition-opacity duration-300 ease-in-out transform ${
                      openProfile
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-2'
                    }`}
                  >
                    <Link
                      href="/profile"
                      className="cursor-pointer rounded-md hover:bg-gray-100 px-4"
                    >
                      <div className="flex flex-row items-center  gap-3 p-2 rounded-sm mb-1">
                        <div>
                          {' '}
                          <FaUser
                            className={`w-6 h-6 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-600'
                            } font-light`}
                          />
                        </div>
                        <Typography variant="h6" className="font-light">
                          Profile
                        </Typography>
                      </div>
                    </Link>
                    <div
                      onClick={() => handleLogout(session.accessToken)}
                      className={`flex flex-row items-center mt- ${
                        theme == 'dark'
                          ? 'bg-white text-gray-800'
                          : 'bg-gray-800 text-white'
                      }  gap-3 p-1 rounded-md mb-1 cursor-pointer`}
                    >
                      <Typography
                        variant="h6"
                        className="font-base text-center  w-full "
                      >
                        Logout
                      </Typography>
                    </div>
                  </div>
                )}
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
          {open && (
            <DrawerNavbar
              session={session}
              open={open}
              openDrawer={openDrawer}
              closeDrawer={closeDrawer}
              handleLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
