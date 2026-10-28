import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/feedSlice';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);

  const isLoading = useSelector((state) => state.feed.isLoading);

  const handleGetFeeds = (): void => {
    dispatch(fetchFeed());
  };

  useEffect(() => {
    dispatch(fetchFeed());

    const intervalId = setInterval(() => {
      dispatch(fetchFeed());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
