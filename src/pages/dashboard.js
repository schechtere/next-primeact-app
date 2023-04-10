import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/auth');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="bg-white w-64 p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <ul className="space-y-4">
          <li>
            <Link href="/home" passHref>
              <span className="text-gray-600 hover:text-blue-500 cursor-pointer">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/bookmark" passHref>
              <span className="text-gray-600 hover:text-blue-500 cursor-pointer">Bookmark</span>
            </Link>
          </li>
          <li>
            <Link href="/profile" passHref>
              <span className="text-gray-600 hover:text-blue-500 cursor-pointer">Profile</span>
            </Link>
          </li>
          <li>
            <Link href="/locations" passHref>
              <span className="text-gray-600 hover:text-blue-500 cursor-pointer">Locations</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Welcome {user?.email}, you are successfully logged in.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
