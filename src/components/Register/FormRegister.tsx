// src/app/register/FormRegister.tsx
'use client';
import { Button, Checkbox, Input } from '@material-tailwind/react';
import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import useAuth from '@/hooks/useAuth';
import { Link, useRouter } from '@/i18n/routing';
import { LoadingImage } from '../LazyLoading/LoadingImage';

type FormRegisterProps = {
  locale: string; // Menerima locale sebagai props
};

function FormRegister({ locale }: FormRegisterProps) {
  const t = useTranslations(); // Assuming 'Register' is the namespace
  const { theme } = useTheme();
  const router = useRouter() as any;

  const { handleRegister, handleSubmit, register, errors, nextUrl } =
    useAuth(locale);
  const [showpassword, setShowPassword] = React.useState(false);
  const [showpasswordCurrent, setShowPasswordCurrent] = React.useState(false);
  React.useEffect(() => {
    if (nextUrl) {
      router.replace(nextUrl);
    }
  }, [nextUrl]);
  return (
    <div
      className={`w-full h-full flex flex-col justify-center px-4 py-10 sm:p-20 ${
        theme === 'dark' ? 'bg-toscaSoft' : 'bg-white'
      }`}
    >
      <LoadingImage
        src="/images/logo/logo.png" // Ensure this path is correct
        width={128}
        height={100}
        className="w-24 sm:w-32 h-auto" // Use h-auto to maintain aspect ratio
        alt={t('LogoImageAlt')}
      />
      <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-10">
        {t('RegisterTitle')}
      </h1>
      <form
        onSubmit={handleSubmit(handleRegister)} // Hubungkan handleSubmit dan onSubmit dari react-hook-form
        className="flex flex-col gap-2"
      >
        <div className="px-3 flex flex-col gap-6">
          <Input
            crossOrigin={undefined}
            {...register('username', { required: t('Username is required') })}
            label={t('UsernameLabel')}
            className="w-full"
            error={!!errors.username} // Menampilkan error jika ada
          />
          {errors.username && (
            <p className="text-red-500 text-xs -mt-5">
              {errors.username.message}
            </p>
          )}

          <Input
            crossOrigin={undefined}
            {...register('email', {
              required: t('Email is required'),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: t('Email is not valid'),
              },
            })}
            label={t('EmailLabel')}
            error={!!errors.email} // Menampilkan error jika ada
          />
          {errors.email && (
            <p className="text-red-500 text-xs -mt-5">{errors.email.message}</p>
          )}

          <Input
            crossOrigin={undefined}
            {...register('name', {
              required: t('Name is required'),
            })}
            label={t('Name')}
            error={!!errors.email} // Menampilkan error jika ada
          />
          {errors.name && (
            <p className="text-red-500 text-xs -mt-5">{errors.name.message}</p>
          )}

          <div className="relative">
            <Input
              crossOrigin={undefined}
              {...register('password', {
                required: t('Password is required'),
                minLength: {
                  value: 6,
                  message: t('Password must be at least 6 characters long'),
                },
                validate: {
                  hasNumber: (value) =>
                    /[0-9]/.test(value) ||
                    t('Password must contain at least one number'),
                },
              })}
              label={t('PasswordLabel')}
              type={showpassword ? 'text' : 'password'}
              error={!!errors.password}
            />
            <div
              className="absolute right-4 top-3 hover:text-toscaSoft"
              onClick={() => setShowPassword(!showpassword)}
            >
              {showpassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs -mt-5">
              {errors.password.message}
            </p>
          )}
          <div className="relative">
            <Input
              crossOrigin={undefined}
              {...register('passwordCurrent', {
                required: t('Current Password is required'),
              })}
              label={t('CurrentPasswordLabel')}
              type={showpasswordCurrent ? 'text' : 'password'}
            />
            <div
              className="absolute right-4 top-3 hover:text-toscaSoft"
              onClick={() => setShowPasswordCurrent(!showpasswordCurrent)}
            >
              {showpasswordCurrent ? <FaRegEye /> : <FaRegEyeSlash />}
            </div>
          </div>
          {errors.passwordCurrent && (
            <p className="text-red-500 text-xs -mt-5">
              {errors.passwordCurrent.message}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-1 sm:gap-2 items-center text-xs md:text-sm text-gray-700">
          <Checkbox
            crossOrigin={undefined}
            {...register('checkBox', {
              required: t('You must accept the terms and conditions'),
            })}
            defaultChecked
          />

          <p>{t('I have accepted the ')}</p>
          <span className="text-xs md:text-sm text-toscaDark hover:text-tosca cursor-pointer">
            {t('Term and Condition')}
          </span>
        </div>
        {errors.checkBox && (
          <p className="text-red-500 text-xs -mt-3 ml-3 ">
            {errors.checkBox.message}
          </p>
        )}
        <Button type="submit" className="bg-toscaDark ">
          <p className="font-bold text-md">{t('RegisterButtonText')}</p>
        </Button>

        <div className=" text-sm text-center  ">
          {t('Already have an account')}
          <Link href="/login">
            <span className="text-red-500"> {t('Login')}</span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default FormRegister;
