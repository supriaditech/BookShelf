import CarouselScreen from '@/components/Home/Carousel';
import MySummary from '@/components/Home/MySummary';
import MasterLayout from '@/components/Layout/MasterLayout';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import { getSession, useSession } from 'next-auth/react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({
  params: { locale },
}: Omit<any, 'children'>) {
  const t = await getTranslations({ locale, namespace: 'BookShelf' });

  return {
    title: t('Home'),
  };
}
type Props = {
  params: { locale: string };
};

export default async function Home({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return (
    <MasterLayout locale={locale}>
      <div className="w-full ">
        <CarouselScreen className="w-full overflow-hidden" />
        <MySummary />
      </div>
    </MasterLayout>
  );
}
