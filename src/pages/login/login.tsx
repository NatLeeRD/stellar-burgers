import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/userSlice';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.user.error);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorText('Введите email и пароль');
      return;
    }

    setErrorText('');
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText || loginError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
