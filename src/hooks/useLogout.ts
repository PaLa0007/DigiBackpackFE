import { useRouter } from 'expo-router';
import { useAuth } from '../store/auth';

export const useLogout = () => {
  const clearUser = useAuth((state) => state.clearUser);
  const router = useRouter();

  return () => {
    clearUser();
    router.replace('/login');
  };
};
