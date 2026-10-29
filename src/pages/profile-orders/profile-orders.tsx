import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/userSlice';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.user.orders);
  const error = useSelector((state) => state.user.ordersError);

  useEffect(() => {
    void dispatch(fetchUserOrders());

    const intervalId = setInterval(() => {
      void dispatch(fetchUserOrders());
    }, 5000);

    return (): void => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  if (error) {
    return <p>Не удалось загрузить заказы: {error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
