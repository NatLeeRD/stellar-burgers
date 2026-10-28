import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';
import type { TOrder, TIngredient } from '../../utils/types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const [fetchedOrder, setFetchedOrder] = useState<TOrder | null>(null);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const orders = useSelector((state) => state.feed.orders);
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const orderNumber = Number(number);
  const orderData =
    orders.find((order) => order.number === orderNumber) ??
    (fetchedOrder?.number === orderNumber ? fetchedOrder : null);

  useEffect(() => {
    if (!number || !Number.isInteger(orderNumber) || orderNumber <= 0) {
      return;
    }

    if (orders.some((order) => order.number === orderNumber)) {
      return;
    }

    let cancelled = false;

    setIsOrderLoading(true);

    getOrderByNumberApi(orderNumber)
      .then((data) => {
        if (!cancelled) {
          setFetchedOrder(data.orders[0] ?? null);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Ошибка загрузки заказа:', error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsOrderLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [number, orderNumber, orders]);

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

  if (isOrderLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <p className="text text_type_main-medium">Заказ не найден</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
