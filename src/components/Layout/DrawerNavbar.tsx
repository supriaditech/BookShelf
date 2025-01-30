import React from 'react';
import { Drawer, IconButton, Typography } from '@material-tailwind/react';
import { GoHomeFill } from 'react-icons/go';
import { BsFillQuestionDiamondFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { Link } from '@/i18n/routing';
import { useTheme } from '@/context/ThemeContext';
import { MdNightlight, MdOutlineNightlight } from 'react-icons/md';
import { useTranslations } from 'next-intl';

interface DrawerNavbar {
  type: string;
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  session: any;
  handleLogout: (value: string) => void;
}

function DrawerNavbar({
  session,
  type,
  open,
  openDrawer,
  closeDrawer,
  handleLogout,
}: DrawerNavbar) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();

  const tabBar = [
    {
      id: 1,
      name: t('home'), // Use translation function
      slug: '/',
      icon: (
        <GoHomeFill
          className={`w-6 h-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-600'
          } font-light`}
        />
      ),
    },
    {
      id: 2,
      name: t('profile'), // Use translation function
      slug: 'profile',
      icon: (
        <FaUser
          className={`w-6 h-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-600'
          } font-light`}
        />
      ),
    },
    {
      id: 3,
      name: t('aboutTab'), // Use translation function
      slug: 'about',
      icon: (
        <BsFillQuestionDiamondFill
          className={`w-6 h-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-600'
          } font-light`}
        />
      ),
    },
  ];

  return (
    <React.Fragment>
      {open && <div className={`fixed inset-0 bg-black opacity-50 z-40`} />}
      <Drawer
        open={open}
        onClose={closeDrawer}
        placement="right"
        className={`p-4 fixed  ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="relative h-full ">
          <div className="mb-2 flex items-center justify-between">
            {session && session?.user?.user ? (
              <div>
                <Typography variant="h5" className="font-bold text-lg">
                  {session?.user?.user.name}
                </Typography>
                <Typography variant="h6" className="font-light -mt-1 text-xs">
                  {session?.user?.user.email}
                </Typography>
              </div>
            ) : (
              <Typography variant="h5" className="font-bold text-lg">
                {t('Menu')}
              </Typography>
            )}
            <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          {tabBar.map((tab: any, index: number) => (
            <Link href={tab.slug} key={index} className="cursor-pointer">
              <div className="flex flex-row items-center  gap-3 p-2 rounded-sm mb-1">
                <div>{tab.icon}</div>
                <Typography variant="h6" className="font-light">
                  {tab.name}
                </Typography>
              </div>
            </Link>
          ))}
          <div
            onClick={() => handleLogout(session.accessToken)}
            className={`flex flex-row items-center mt- ${
              theme == 'dark'
                ? 'bg-white text-gray-800'
                : 'bg-gray-800 text-white'
            } gap-3 p-1 rounded-md mb-1 cursor-pointer`}
          >
            <Typography variant="h6" className="font-base text-center w-full ">
              Logout
            </Typography>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full flex flex-col justify-center items-center absolute bottom-0 right-0 ${
              theme === 'dark'
                ? 'bg-white text-gray-800 '
                : 'bg-gray-800 text-white'
            }`}
          >
            {theme === 'light' ? <MdOutlineNightlight /> : <MdNightlight />}
          </button>
        </div>
      </Drawer>
    </React.Fragment>
  );
}

export default DrawerNavbar;
