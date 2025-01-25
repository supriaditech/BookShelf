// src/hooks/useAuth.ts
import { useForm, SubmitHandler } from 'react-hook-form';
import Api from '../../service/api';

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  passwordCurrent: string;
  checkBox: boolean;
}

const useAuth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError, // Tambahkan setError untuk menangani error
  } = useForm<RegisterFormInputs>();

  const handleRegister: SubmitHandler<RegisterFormInputs> = async (data) => {
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
    });

    try {
      const response = await api.call('POST');
      return response; // Mengembalikan respons dari API
    } catch (error) {
      console.error('Error registering user:', error);
      throw error; // Melempar kembali error untuk ditangani di tempat lain
    }
  };

  return {
    handleRegister,
    handleSubmit,
    register,
    errors,
  };
};

export default useAuth;
