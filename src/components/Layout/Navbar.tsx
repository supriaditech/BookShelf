'use client';
import { useTheme } from '@/context/ThemeContext'; // Mengimpor useTheme dari ThemeContext
import { Link } from '@/i18n/routing';
import { MdNightlight, MdOutlineNightlight } from 'react-icons/md';
import LanguageSwitcher from './LocaleSwitcher';
import useAuth from '@/hooks/useAuth';
interface NavbarProps {
  session: any;
  locale: string;
}
const Navbar = ({ session, locale }: NavbarProps) => {
  const { handleLogout } = useAuth(locale);
  const { theme, toggleTheme } = useTheme(); // Mengambil tema dan fungsi toggle dari context
  return (
    <nav
      className={`fixed top-0 w-screen p-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } text-${theme === 'dark' ? 'white' : 'black'} shadow`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href="/">MyApp</Link>
        </div>
        <ul className="flex space-x-20 w-full justify-center">
          <li>
            <Link href="/" className="hover:underline">
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
        <LanguageSwitcher />
        <div className="flex flex-row gap-1 justify-items-end items-center">
          {!session ? (
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
          ) : (
            <div onClick={() => handleLogout(session.accessToken)}>Logout</div>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
