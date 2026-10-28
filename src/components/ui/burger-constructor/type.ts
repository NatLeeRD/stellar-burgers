import type { TConstructorState, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorState;
  orderRequest: boolean;
  error?: string | null;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
