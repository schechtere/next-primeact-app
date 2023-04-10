import { supabase } from '../supabaseClient';
import useAuth from '../hooks/useAuth';

export async function getServerSideProps(context) {
  const { user } = await supabase.auth.api.getUserByCookie(context.req);

  if (!user) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}

const ProtectedPage = () => {
  const { user } = useAuth();

  return (
    <div>
      {user && <h1>This is a protected page. Welcome, {user.email}!</h1>}
    </div>
  );
};

export default ProtectedPage;
