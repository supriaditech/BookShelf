'use client';

import { usePathname, useRouter } from '@/i18n/routing';
// import { usePathname, useRouter } from 'next-intl/client';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="flex px-4 py-2 gap-1">
      <div
        onClick={() => changeLanguage('en')}
        className="hover:text-purple cursor-pointer"
      >
        EN
      </div>
      <p>|</p>
      <div
        onClick={() => changeLanguage('id')}
        className="hover:text-purple cursor-pointer"
      >
        ID
      </div>
    </div>
  );
}
