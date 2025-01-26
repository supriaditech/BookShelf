// src/hooks/useAuth.ts
import { useForm, SubmitHandler } from 'react-hook-form';
import Api from '../../service/api';
import React from 'react';
import { signIn, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import { destroyCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';
interface AuthFormInputs {
  username: string;
  email: string;
  password: string;
  passwordCurrent: string;
  checkBox: boolean;
  name: string;
}

const useAuth = (locale: string) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError, // Tambahkan setError untuk menangani error
  } = useForm<AuthFormInputs>();
  const [loadingLogin, setLoadingLogin] = React.useState<boolean>(false);
  const [nextUrl, setNextUrl] = React.useState<string | any>(null);
  const handleRegister: SubmitHandler<AuthFormInputs> = async (data) => {
    const id = toast.loading('Registering your account...');
    // Validasi untuk memastikan passwordCurrent sama dengan password
    if (data.password !== data.passwordCurrent) {
      setError('passwordCurrent', {
        type: 'manual',
        message: 'Password current harus sama dengan password',
      });
      return null; // Hentikan eksekusi jika validasi gagal
    }

    const api = new Api('/api/auth/register', false, 'json');
    api.setBody({
      username: data.username,
      email: data.email,
      password: data.password,
      name: data.name,
    });

    try {
      const response = await api.call('POST');
      if (response.meta.statusCode === 201) {
        toast.update(id, {
          render: (
            <p className="text-base font-bold">Your account registered.</p>
          ),
          type: 'success',
          autoClose: 3000,
          isLoading: false,
        });

        setTimeout(async () => {
          toast.update(id, {
            render: <p className="text-base font-bold">Sign in your account</p>,
            type: 'success',
            autoClose: 3000,
            isLoading: false,
          });
          handlerLogin(data);
        });
      } else
        toast.error(`Register failed ${response.meta.message}`, {
          autoClose: 3000,
        });
    } catch (error) {
      toast.error(`Register failed ${error}`, {
        autoClose: 3000,
      });
    }
  };

  const handlerLogin: SubmitHandler<AuthFormInputs> = async (data) => {
    setLoadingLogin(true);
    try {
      const signInResponse = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: process.env.NEXT_PUBLIC_BASE_URL || '/',
      });

      if (!signInResponse) {
        console.error('No response from server');
        throw new Error('No response from server');
      }

      // Cek apakah login berhasil
      if (signInResponse.ok && signInResponse.status === 200) {
        const cookies = parseCookies();
        let nextUrl = `/${locale}`; // Set default nextUrl dengan locale

        if (cookies.nextSession) {
          const nextSessionObj = JSON.parse(cookies.nextSession);
          nextUrl = nextSessionObj.url;
          destroyCookie(null, 'nextSession');
        } else {
          const raw = window.localStorage.getItem('nextSession') ?? '';

          if (raw !== '' && raw !== undefined && raw !== null) {
            const stored = JSON.parse(raw);
            if (stored) {
              nextUrl = String(stored?.url);
            }
          } else if (signInResponse.url) {
            nextUrl = String(signInResponse.url);
          }
        }

        // Pastikan nextUrl mengandung locale
        if (!nextUrl.startsWith(`/${locale}`)) {
          nextUrl = `${nextUrl}${locale}`; // Tambahkan locale jika belum ada
        }

        setNextUrl(nextUrl);
        toast.success('Login successful!', { autoClose: 3000 });
      } else {
        console.error('Login failed:', signInResponse.error);
        throw new Error(signInResponse.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(
        'Login failed, Silahkan masukan user id dan password yang benar',
        {
          autoClose: 3000,
        },
      );
    } finally {
      setLoadingLogin(false); // Pastikan loading diatur ke false di akhir
    }
  };

  const handleLogout = async (token: string) => {
    const id = toast.loading('Logout your account...');

    const api = new Api('/api/auth/logout', true, 'json');
    api.token = token;
    try {
      const response = await api.call('POST');
      if (response.meta.statusCode === 200) {
        toast.update(id, {
          render: <p className="text-base font-bold">Your account logout.</p>,
          type: 'success',
          autoClose: 3000,
          isLoading: false,
        });

        setTimeout(async () => {
          toast.update(id, {
            render: <p className="text-base font-bold">Redirect Page Login</p>,
            type: 'success',
            autoClose: 3000,
            isLoading: false,
          });
        });
        signOut({ callbackUrl: '/' });
      } else
        toast.update(id, {
          render: (
            <p className="text-base font-bold">
              `Logout failed ${response.meta.message}`
            </p>
          ),
          type: 'error',
          autoClose: 3000,
          isLoading: false,
        });
    } catch (error) {
      toast.update(id, {
        render: <p className="text-base font-bold">`Logout failed `</p>,
        type: 'error',
        autoClose: 3000,
        isLoading: false,
      });
    }
  };

  return {
    handleRegister,
    handleSubmit,
    register,
    handlerLogin,
    errors,
    nextUrl,
    loadingLogin,
    handleLogout,
  };
};

export default useAuth;
