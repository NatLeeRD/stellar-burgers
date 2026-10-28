import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUserApi } from '../../utils/burger-api';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setErrorText('');

    registerUserApi({
      name: userName,
      email,
      password,
    })
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        setErrorText(error.message ?? 'Ошибка регистрации');
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
