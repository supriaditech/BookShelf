import MasterLayout from '@/components/Layout/MasterLayout';
import FormLogin from '@/components/Login/FormLogin';
import ImageLogin from '@/components/Login/ImageLogin';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Omit<any, 'children'>) {
  const t = await getTranslations({ locale, namespace: 'BookShelf' });

  return {
    title: t('Login'),
  };
}

function login({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return (
    <MasterLayout locale={locale}>
      <div className="w-full flex flex-col items-center justify-center min-h-screen py-28 sm:py-32 lg:py-0  px-4  sm:px-0">
        <div className="container h-full lg:flex flex-row items-stretch shadow-md border border-gray-200">
          {/* Changed items-center to items-stretch */}
          <FormLogin locale={locale} />
          <ImageLogin />
        </div>
      </div>
    </MasterLayout>
  );
}

export default login;
