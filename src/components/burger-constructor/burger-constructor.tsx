import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

import {
  clearOrder,
  createOrderPending,
  createOrderSuccess,
  createOrderFailed,
} from '../../services/orderSlice';

import type { TConstructorIngredient } from '@utils-types';

import { orderBurgerApi } from '../../utils/burger-api';
import { clearConstructor } from '../../services/constructorSlice';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems = useSelector((state) => state.burgerConstructor);

  const orderRequest = useSelector((state) => state.order.orderRequest);

  const orderError = useSelector((state) => state.order.error);

  const orderModalData = useSelector((state) => state.order.orderModalData);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', {
        state: { from: '/' },
      });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id,
    ];

    dispatch(createOrderPending());

    orderBurgerApi(ingredientIds)
      .then((response) => {
        dispatch(createOrderSuccess(response.order));
        dispatch(clearConstructor());
      })
      .catch((error) => {
        dispatch(createOrderFailed(error.message ?? 'Ошибка оформления заказа'));
      });
  };

  const closeOrderModal = (): void => {
    if (orderRequest) return;

    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      error={orderError}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
