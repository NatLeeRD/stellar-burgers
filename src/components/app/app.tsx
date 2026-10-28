import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/ingredientsSlice';
import { checkUserAuth, setAuthChecked } from '../../services/userSlice';
import { getCookie } from '../../utils/cookie';
import { AppHeader } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '../../pages';

import { Preloader } from '@ui';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import type { AppContentProps } from './type';
import '../../index.css';
import { Modal } from '@components';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isIngredientsLoading = useSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useSelector((state) => state.ingredients.error);
  useEffect(() => {
    dispatch(fetchIngredients());
    if (getCookie('accessToken') || localStorage.getItem('refreshToken')) {
      dispatch(checkUserAuth());
    } else {
      dispatch(setAuthChecked());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

const AppContent = ({
  //ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {error}
      </p>
    );
  }
  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const backgroundLocation = location.state?.background;

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<ConstructorPage />} />

        <Route path="/feed" element={<Feed />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route path="/feed/:number" element={<OrderInfo />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path="/feed/:number"
            element={
              <Modal title="" onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title="" onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
