import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; 
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setProfile(response.data); 
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch profile');
        toast.error('Failed to fetch profile');
      }
    };

    if (token) {
      fetchProfile(); 
    }
  }, [token]); 

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
        {profile ? (
          <div>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Account Created At:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}
