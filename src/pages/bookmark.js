import React from 'react';
import TimeBar from '../components/TimeBar';
import Layout from '../components/Layout';

const Bookmark = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-20">
        <h1>Bookmark</h1>
        <p>Welcome to the Bookmark page.</p>
        <TimeBar />
      </div>
    </Layout>
  );
};

export default Bookmark;
