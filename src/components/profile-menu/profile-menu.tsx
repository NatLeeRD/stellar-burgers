import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { clearUser } from '../../services/userSlice';
import { logoutApi } from '../../utils/burger-api';
import { deleteCookie } from '../../utils/cookie';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logoutApi()
      .then(() => {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');

        dispatch(clearUser());
        navigate('/login', { replace: true });
      })
      .catch((error) => {
        console.error('Ошибка выхода из аккаунта:', error);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
