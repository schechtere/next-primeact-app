import React from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient';

const Header = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <header className="bg-blue-500 p-4 text-white fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">My App</span>
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/">
                <span className="text-white cursor-pointer hover:text-blue-300">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/bookmark">
                <span className="text-white cursor-pointer hover:text-blue-300">Bookmark</span>
              </Link>
            </li>
            <li>
              <Link href="/profile">
                <span className="text-white cursor-pointer hover:text-blue-300">Profile</span>
              </Link>
            </li>
            {user && (
              <li className="text-white mx-4">
                {user.email}
              </li>
            )}
            <li>
              <button onClick={handleSignOut} className="text-white font-semibold hover:text-blue-300">
                Log out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
