import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import  supabase  from '../supabaseClient';
import  { useAuth } from '../hooks/useAuth';

const Auth = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const {  data, error } = await supabase.auth.signUp({ email, password });

    console.log(JSON.stringify(data));

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log(JSON.stringify(data));


    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96">
        <h1 className="text-2xl font-semibold mb-4">Authentication</h1>
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Sign Up
            </button>
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded-md"
            >
              Sign In
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Auth;
