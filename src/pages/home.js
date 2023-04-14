import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import supabase from '../supabaseClient';
import Layout from '../components/Layout';

import { format } from 'date-fns';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('post_date', { ascending: false });

    if (data) {
      setPosts(data);
    } else {
      console.error(error);
    }
  };

  return (
    <Layout>
        <div className="container mx-auto px-4 pt-20">
          <h1 className="text-4xl font-semibold mb-6">Your Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <p className="text-gray-600 text-sm">{formatDate(post.post_date)}</p>
                <p className="text-gray-700 mt-4">{post.body}</p>
              </div>
            ))}
          </div>
        </div>
    </Layout>
  );
};

export default Home;
