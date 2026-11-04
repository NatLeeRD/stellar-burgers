import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { fetchOrderByNumber } from '../../services/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '../../utils/types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.user.orders);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const fetchedOrder = useSelector((state) => state.order.fetchedOrder);
  const isOrderLoading = useSelector((state) => state.order.fetchedOrderLoading);
  const orderError = useSelector((state) => state.order.fetchedOrderError);

  const orderNumber = Number(number);
  const isValidOrderNumber =
    !!number && Number.isInteger(orderNumber) && orderNumber > 0;

  const orderData =
    orders.find((order) => order.number === orderNumber) ??
    userOrders.find((order) => order.number === orderNumber) ??
    (fetchedOrder?.number === orderNumber ? fetchedOrder : null);

  useEffect(() => {
    if (!isValidOrderNumber || orderData || isOrderLoading || orderError) {
      return;
    }

    void dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, isValidOrderNumber, orderNumber, orderData, isOrderLoading, orderError]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (isOrderLoading && !orderData) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <p className="text text_type_main-medium">{orderError ?? 'Заказ не найден'}</p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
