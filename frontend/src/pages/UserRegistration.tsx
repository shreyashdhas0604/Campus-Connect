import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import apiClient from '../utils/apiClient';
import toast,{Toaster} from 'react-hot-toast';


// Define types for form input
interface IUserFormInput {
  email: string;
  username: string;
  name: string;
  password: string;
  department: string;
  year: string;
  division: string;
  contactNumber : string;
}

// Create a Yup validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Enter a valid email'),
  username: Yup.string().required('Username is required'),
  name: Yup.string().required('Name is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  department: Yup.string().required('Department is required'),
  year: Yup.string().required('Year is required'),
  division: Yup.string().required('Division is required'),
  contactNumber : Yup.string()
  .required('Contact Number is required')
  .matches(/^\d{10}$/, 'Contact Number must be 10 digits'),
});

const RegisterUser: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IUserFormInput>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit: SubmitHandler<IUserFormInput> = async data => {
    console.log('Registration Data:', data);
    try {
      const response = await apiClient.post('/user/register-user', data);
      console.log('User Registration Response:', response.data);
      //clear the registration form and show a success message
      // Clear the registration forma
      Object.keys(data).forEach(key => {
        const inputElement = document.getElementById(key) as HTMLInputElement;
        if (inputElement) {
          inputElement.value = '';
        }
      });

      toast.success('User registered successfully!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.log(error);
      const errorMessage = (error as any)?.response?.data?.message || 'An error occurred!';
      toast.error(errorMessage);
      console.error('User Registration Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position='top-right'/>
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="mb-2 text-center text-3xl font-extrabold text-gray-900">
          Campus Connect Registration
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Please fill in your details to register.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              {...register('name')}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              {...register('username')}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
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
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
            </label>
            <input
              id="contactNumber"
              type="tel"
              placeholder="Contact Number"
              {...register('contactNumber')}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.contactNumber ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.contactNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.contactNumber.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            </label>
            <select
              id="department"
              {...register('department')}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.department ? 'border-red-500' : 'border-gray-300'
              } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            >
              <option value="">Select Department</option>
              <option value="CE">CE</option>
              <option value="IT">IT</option>
              <option value="ENTC">ENTC</option>
            </select>
            {errors.department && (
              <p className="mt-1 text-xs text-red-600">{errors.department.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              </label>
              <select
                id="year"
                {...register('year')}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select Year</option>
                <option value="FIRST">FIRST</option>
                <option value="SECOND">SECOND</option>
                <option value="THIRD">THIRD</option>
                <option value="FOURTH">FOURTH</option>
              </select>
              {errors.year && (
                <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700">
              </label>
              <select
                id="division"
                {...register('division')}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.division ? 'border-red-500' : 'border-gray-300'
                } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select Division</option>
                <option value="DIV1">DIV1</option>
                <option value="DIV2">DIV2</option>
                <option value="DIV3">DIV3</option>
                <option value="DIV4">DIV4</option>
                <option value="DIV5">DIV5</option>
                <option value="DIV6">DIV6</option>
                <option value="DIV7">DIV7</option>
                <option value="DIV8">DIV8</option>
                <option value="DIV9">DIV9</option>
                <option value="DIV10">DIV10</option>
                <option value="DIV11">DIV11</option>
                <option value="DIV12">DIV12</option>
                <option value="DIV13">DIV13</option>
              </select>
              {errors.division && (
                <p className="mt-1 text-xs text-red-600">{errors.division.message}</p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
