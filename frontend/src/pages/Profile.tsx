import { useAuthStore } from '../store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Navigation } from '../components/Navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../api/client';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function Profile() {
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const profile = user?.profile || { firstName: '', lastName: '', phone: '', bio: '', address: '' };

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      address: profile.address || '',
    },
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: pErrors }, reset: resetPassword } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      let photoUrl = user?.profile?.photoUrl;
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        const uploadRes = await api.post('/profile/upload-photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrl = uploadRes.data.photoUrl;
      }
      await api.put('/profile', { ...data, photoUrl });
      await checkAuth(); // refresh user state
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
      setPhotoFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      await api.put('/profile/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  if (!user) return <><Navigation /><div className="p-6 text-center">Please log in to view your profile.</div></>;

  return (
    <>
      <Navigation />
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {/* Profile Card */}
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-300 overflow-hidden">
                    {photoFile ? (
                      <img src={URL.createObjectURL(photoFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : profile.photoUrl ? (
                      <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1 cursor-pointer hover:bg-indigo-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-semibold">{profile.firstName} {profile.lastName}</p>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">Role: {user.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input {...register('firstName')} className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                  <input {...register('lastName')} className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input {...register('phone')} className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <input {...register('address')} className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
              <textarea {...register('bio')} rows={3} className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? 'Saving...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <input {...registerPassword('currentPassword')} type="password" className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
              {pErrors.currentPassword && <p className="text-red-500 text-sm">{pErrors.currentPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <input {...registerPassword('newPassword')} type="password" className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
              {pErrors.newPassword && <p className="text-red-500 text-sm">{pErrors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <input {...registerPassword('confirmPassword')} type="password" className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
              {pErrors.confirmPassword && <p className="text-red-500 text-sm">{pErrors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full md:w-auto" variant="secondary">
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
