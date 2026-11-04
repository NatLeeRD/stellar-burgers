import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

describe('ingredientsSlice reducer', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('сохраняет ингредиенты при fetchIngredients.fulfilled', () => {
    const mockIngredients = [
      {
        _id: '123',
        name: 'Тестовая булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 150,
        price: 100,
        image: 'test-image.png',
        image_mobile: 'test-mobile.png',
        image_large: 'test-large.png',
      },
    ];

    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(mockIngredients, 'test-request-id')
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null,
    });
  });

  test('устанавливает состояние загрузки при fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('test-request-id')
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  test('сохраняет ошибку при fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(new Error('Ошибка сервера'), 'test-request-id')
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка сервера',
    });
  });
});
