import ContentBook from '@/components/Book/DetailBook/ContentBook';
import MasterLayout from '@/components/Layout/MasterLayout';
import authOptions from '@/lib/auth';
import { SessionType } from '@/types/SessionType';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import React from 'react';

type Props = {
  params: { locale: string };
};

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
    title: t('Detail Book'),
  };
}

const page = async ({
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
          <ContentBook session={session} slug={slug} />
        ) : (
          <p>Please log in to see categories.</p>
        )}
      </div>
    </MasterLayout>
  );
};

export default page;
