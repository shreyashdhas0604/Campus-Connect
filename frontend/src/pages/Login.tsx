import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import apiClient from '../utils/apiClient';

interface ILoginFormInput {
  email: string;
  password: string;
}

interface OLoginResponse {
    success: boolean;
    message: string;
    data: {
        userData: {
            id: string;
            name: string;
            username : string;
            email: string;
        };
        accessToken: string;
        refreshToken: string;
    };
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Enter a valid email'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ILoginFormInput> = async data => {
    console.log('Login Data:', data);
    try {
        const response = await apiClient.post<OLoginResponse>('/user/login', data);
        console.log('User Login Response:', response.data);
        const refToken = response?.data?.data?.refreshToken;
        const acssToken = response?.data?.data?.accessToken;
        localStorage.setItem('accessToken', acssToken);
        localStorage.setItem('refreshToken', refToken);
        alert('Login successful!');
    } catch (error) {
        console.error('User Login Error:', error);
        alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
          Login to Campus Connect
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              {...register('email')}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              {...register('password')}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
