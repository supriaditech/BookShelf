import CarouselScreen from '@/components/Home/Carousel';
import CategoryComponent from '@/components/Home/CategoryComponent';
import MySummary from '@/components/Home/MySummary';
import MasterLayout from '@/components/Layout/MasterLayout';
import authOptions from '@/lib/auth';
import { SessionType } from '@/types/SessionType';
import { getServerSession } from 'next-auth';
import { getTranslations, setRequestLocale } from 'next-intl/server';

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
  const session: SessionType | null = await getServerSession(authOptions);
  setRequestLocale(locale);

  return (
    <MasterLayout locale={locale}>
      <div className="w-full">
        <CarouselScreen className="w-full overflow-hidden" />
        <MySummary />
        {session ? ( // Memeriksa apakah session tidak null
          <CategoryComponent session={session} />
        ) : (
          <p>Please log in to see categories.</p> // Pesan jika session null
        )}
      </div>
    </MasterLayout>
  );
}
