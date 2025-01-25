import MasterLayout from '@/components/Layout/MasterLayout';
import FormRegister from '@/components/Register/FormRegister';
import ImageRegister from '@/components/Register/ImageRegister';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Omit<any, 'children'>) {
  const t = await getTranslations({ locale, namespace: 'BookShelf' });

  return {
    title: t('Register'),
  };
}

function Register({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return (
    <MasterLayout>
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <div className="container h-full flex flex-row items-stretch shadow-md border border-gray-200">
          {/* Changed items-center to items-stretch */}
          <FormRegister /> {/* Ensure FormRegister can grow */}
          <ImageRegister />
        </div>
      </div>
    </MasterLayout>
  );
}

export default Register;
