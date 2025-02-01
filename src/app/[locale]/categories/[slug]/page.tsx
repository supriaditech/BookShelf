import ListBookBySlug from '@/components/Categories/DetailCategories/ListBookBySlug';
import MasterLayout from '@/components/Layout/MasterLayout';
import authOptions from '@/lib/auth';
import { SessionType } from '@/types/SessionType';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'BookShelf',
  });
  return {
    title: t('Details Categories'), // Mengambil terjemahan untuk "Details Categories"
  };
}

type Props = {
  params: { locale: string; slug: string }; // Menambahkan slug ke dalam params
};

const CategoryDetail = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>; // Menambahkan locale ke dalam params
}) => {
  const { slug, locale } = await params; // Mengambil slug dan locale
  const t = await getTranslations({ locale, namespace: 'BookShelf' }); // Mengambil terjemahan berdasarkan locale
  const session: SessionType | null = await getServerSession(authOptions);
  return (
    <MasterLayout locale={locale}>
      <div className="container mx-auto py-10">
        {session ? (
          <ListBookBySlug session={session} slug={slug} />
        ) : (
          <p>Please log in to see categories.</p> // Pesan jika session null
        )}
      </div>
    </MasterLayout>
  );
};

export default CategoryDetail;
