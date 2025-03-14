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
  return {};
}

const CategoryDetail = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) => {
  const { slug, locale } = await params;
  const session: SessionType | null = await getServerSession(authOptions);
  return (
    <MasterLayout locale={locale}>
      <div className="container mx-auto py-10">
        {session ? (
          <ListBookBySlug session={session} slug={slug} />
        ) : (
          <p>Please log in to see categories.</p>
        )}
      </div>
    </MasterLayout>
  );
};

export default CategoryDetail;
