import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import apiClient from '../utils/apiClient';

interface IProfileFormInput {
  name: string;
  username: string;
  email: string;
  department: string;
  year: string;
  division: string;
  profilePic?: FileList | null;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().required('Email is required').email('Enter a valid email'),
  department: Yup.string().required('Department is required'),
  year: Yup.string().required('Year is required'),
  division: Yup.string().required('Division is required'),
  profilePic: Yup.mixed<FileList>()
    .transform((value, originalValue) =>
      originalValue && (originalValue as FileList).length > 0 ? originalValue : null
    )
    .nullable(),
});

const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentPicUrl, setCurrentPicUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>({});
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IProfileFormInput>({
    resolver: yupResolver<IProfileFormInput>(validationSchema),
  });

  const watchProfilePic = watch('profilePic');

  // Generate a preview URL when a new file is selected.
  useEffect(() => {
    if (watchProfilePic && watchProfilePic.length > 0) {
      const file = watchProfilePic[0];
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    } else {
      setPreviewImage(null);
    }
  }, [watchProfilePic]);

  // Fetch the user's profile from the backend and populate the form.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/user/profile');
        console.log('Profile data:', response.data);
        const userData = (response.data as { data: any }).data;
        setCurrentPicUrl(userData.profilePicUrl || null);
        // Populate form fields with the fetched data.
        setProfileData(userData);
        reset({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          department: userData.department,
          year: userData.year,
          division: userData.division,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit: SubmitHandler<IProfileFormInput> = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('department', data.department);
    formData.append('year', data.year);
    formData.append('division', data.division);
    if (data.profilePic && data.profilePic.length > 0) {
      formData.append('profilePic', data.profilePic[0]);
    }

    try {
      const response: any = await apiClient.put('/user/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Profile updated successfully:', response.data);
      setCurrentPicUrl(response.data?.profilePicUrl);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    setPreviewImage(null);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    // Reset the file input field.
    reset({ ...watch(), profilePic: null });
  };

  if (loading) return <p>Loading...</p>;

  // Compute background color class for inputs.
  const inputBg = !isEditing ? 'bg-gray-100' : 'bg-white';

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Profile Management</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Edit
            </button>
          )}
        </div>
        <div className="flex flex-col md:flex-row">
          {/* Profile Picture Section */}
            <div className="flex flex-col items-center md:mr-8 mb-6 md:mb-0">
            <div className="w-48 h-48 border border-gray-300 rounded overflow-hidden flex items-center justify-center">
              {previewImage ? (
              <img src={previewImage} alt="Preview" className="object-cover w-full h-full" />
              ) : currentPicUrl ? (
              <img src={currentPicUrl} alt="Profile" className="object-cover w-full h-full" />
              ) : (
              profileData.profilePic ? (
                <img src={profileData.profilePic} alt="Profile " className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-400">No Photo</span>
              )
              )}
            </div>
            {isEditing && (
              <div className="mt-2 flex items-center space-x-2">
              <input id="profilePic" type="file" {...register('profilePic')} className="block" />
              {previewImage && (
                <button
                type="button"
                onClick={handleRemoveImage}
                className="text-red-600 hover:text-red-800"
                >
                &times;
                </button>
              )}
              </div>
            )}
            </div>
          {/* Profile Details Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  {...register('name')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inputBg}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  {...register('username')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inputBg}`}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
                )}
              </div>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  {...register('email')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${inputBg}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
              {/* Department Field */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  id="department"
                  {...register('department')}
                  disabled={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  } ${inputBg} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
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
              {/* Year and Division Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <select
                    id="year"
                    {...register('year')}
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    } ${inputBg} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  >
                    <option value="">Select Year</option>
                    <option value="FIRST">First</option>
                    <option value="SECOND">Second</option>
                    <option value="THIRD">Third</option>
                    <option value="FOURTH">Fourth</option>
                  </select>
                  {errors.year && (
                    <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                    Division
                  </label>
                  <select
                    id="division"
                    {...register('division')}
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.division ? 'border-red-500' : 'border-gray-300'
                    } ${inputBg} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
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
              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Update Profile
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
