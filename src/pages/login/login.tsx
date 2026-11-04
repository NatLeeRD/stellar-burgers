import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/userSlice';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const loginError = useSelector((state) => state.user.error);
  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorText('Введите email и пароль');
      return;
    }

    setErrorText('');
    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText ? errorText : (loginError ?? '')}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
