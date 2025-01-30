import ListCategories from '@/components/Categories/ListCategories';
import MasterLayout from '@/components/Layout/MasterLayout';
import authOptions from '@/lib/auth';
import { SessionType } from '@/types/SessionType';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import React from 'react';

export async function generateMetadata({
  params: { locale },
}: Omit<any, 'children'>) {
  const t = await getTranslations({ locale, namespace: 'BookShelf' });

  return {
    title: t('Categories'),
  };
}

type Props = {
  params: { locale: string };
};

async function page({ params: { locale } }: Props) {
  const session: SessionType | null = await getServerSession(authOptions);
  return (
    <MasterLayout locale={locale}>
      <div className="container mx-auto py-10">
        {session ? ( // Memeriksa apakah session tidak null
          <ListCategories session={session} />
        ) : (
          <p>Please log in to see categories.</p> // Pesan jika session null
        )}
      </div>
    </MasterLayout>
  );
}

export default page;
