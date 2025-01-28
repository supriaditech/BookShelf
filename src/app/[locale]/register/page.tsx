import MasterLayout from '@/components/Layout/MasterLayout';
import FormRegister from '@/components/Register/FormRegister';
import ImageRegister from '@/components/Register/ImageRegister';
import { getTranslations, setRequestLocale } from 'next-intl/server';
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
    <MasterLayout locale={locale}>
      <div className="w-full flex flex-col items-center sm:justify-center min-h-screen py-4 sm:py-32 lg:py-0  px-4  sm:px-0">
        <div className="container h-full lg:flex flex-row items-stretch shadow-md border border-gray-200">
          {/* Changed items-center to items-stretch */}
          <FormRegister locale={locale} /> {/* Ensure FormRegister can grow */}
          <ImageRegister />
        </div>
      </div>
    </MasterLayout>
  );
}

export default Register;
