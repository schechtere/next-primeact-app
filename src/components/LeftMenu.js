// components/LeftMenu.js
import Link from 'next/link';

const LeftMenu = () => {
  return (
    <nav>
      <ul className="space-y-4">
        <li>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/bookmark" className="text-blue-600 hover:text-blue-800">
            Bookmark
          </Link>
        </li>
        <li>
          <Link href="/profile" className="text-blue-600 hover:text-blue-800">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/locations" className="text-blue-600 hover:text-blue-800">
            Locations
          </Link>
        </li>
        <li>
          <Link href="/locations_table" className="text-blue-600 hover:text-blue-800">
            Locations Table
          </Link>
        </li>
        <li>
          <Link href="/locations_table_ss_filter" className="text-blue-600 hover:text-blue-800">
            Locations Table SS Filter
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LeftMenu;
