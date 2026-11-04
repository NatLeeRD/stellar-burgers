import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/userSlice';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setErrorText('');

    dispatch(
      registerUser({
        name: userName,
        email,
        password,
      })
    )
      .unwrap()
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setErrorText(error.message);
        } else {
          setErrorText('Ошибка регистрации');
        }
      });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
