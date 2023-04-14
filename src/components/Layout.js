// components/Layout.js
import Header from './Header';
import LeftMenu from './LeftMenu';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <LeftMenu />
          </div>
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
