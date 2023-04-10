import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
    const { user } = useAuth();
  
    return (
      <header>
        {user && (
          <>
            <span>Welcome, {user.email}!</span>
          </>
        )}
      </header>
    );
  };
  
  export default Header;
  