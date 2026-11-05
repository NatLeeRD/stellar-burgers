import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './constructorSlice';

describe('constructorSlice reducer', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('добавляет булку в конструктор', () => {
    const mockBun = {
      _id: '123',
      id: 'test-bun-id',
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
    };
    const state = constructorReducer(undefined, addIngredient(mockBun));
    expect(state).toEqual({
      bun: mockBun,
      ingredients: [],
    });
  });

  test('добавляет начинку в конструктор', () => {
    const mockIngredient = {
      _id: '456',
      id: 'test-ingredient-id',
      name: 'Тестовая котлета',
      type: 'main',
      proteins: 20,
      fat: 10,
      carbohydrates: 5,
      calories: 200,
      price: 150,
      image: 'test-image.png',
      image_mobile: 'test-mobile.png',
      image_large: 'test-large.png',
    };
    const state = constructorReducer(undefined, addIngredient(mockIngredient));
    expect(state).toEqual({
      bun: null,
      ingredients: [mockIngredient],
    });
  });

  test('заменяет существующую булку новой', () => {
    const firstBun = {
      _id: '123',
      id: 'first-bun-id',
      name: 'Первая булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'first.png',
      image_mobile: 'first-mobile.png',
      image_large: 'first-large.png',
    };
    const secondBun = {
      ...firstBun,
      _id: '456',
      id: 'second-bun-id',
      name: 'Вторая булка',
    };
    const stateWithFirstBun = constructorReducer(undefined, addIngredient(firstBun));
    const stateWithSecondBun = constructorReducer(
      stateWithFirstBun,
      addIngredient(secondBun)
    );
    expect(stateWithSecondBun).toEqual({
      bun: secondBun,
      ingredients: [],
    });
  });

  test('удаляет начинку по id', () => {
    const firstIngredient = {
      _id: '123',
      id: 'first-id',
      name: 'Первая начинка',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'first.png',
      image_mobile: 'first-mobile.png',
      image_large: 'first-large.png',
    };
    const secondIngredient = {
      ...firstIngredient,
      _id: '456',
      id: 'second-id',
      name: 'Вторая начинка',
    };
    const stateWithFirst = constructorReducer(undefined, addIngredient(firstIngredient));
    const stateWithBoth = constructorReducer(
      stateWithFirst,
      addIngredient(secondIngredient)
    );
    const stateAfterRemoval = constructorReducer(
      stateWithBoth,
      removeIngredient('first-id')
    );
    expect(stateAfterRemoval).toEqual({
      bun: null,
      ingredients: [secondIngredient],
    });
  });

  test('изменяет порядок начинок в конструкторе', () => {
    const firstIngredient = {
      _id: '123',
      id: 'first-id',
      name: 'Первая начинка',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'first.png',
      image_mobile: 'first-mobile.png',
      image_large: 'first-large.png',
    };

    const secondIngredient = {
      ...firstIngredient,
      _id: '456',
      id: 'second-id',
      name: 'Вторая начинка',
    };

    const stateWithFirst = constructorReducer(undefined, addIngredient(firstIngredient));

    const stateWithBoth = constructorReducer(
      stateWithFirst,
      addIngredient(secondIngredient)
    );

    const stateAfterMove = constructorReducer(
      stateWithBoth,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(stateAfterMove).toEqual({
      bun: null,
      ingredients: [secondIngredient, firstIngredient],
    });
  });

  test('не изменяет состояние при недопустимых индексах', () => {
    const mockIngredient = {
      _id: '123',
      id: 'test-id',
      name: 'Тестовая начинка',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'test.png',
      image_mobile: 'test-mobile.png',
      image_large: 'test-large.png',
    };

    const initialState = constructorReducer(undefined, addIngredient(mockIngredient));

    const stateAfterMove = constructorReducer(
      initialState,
      moveIngredient({ fromIndex: 0, toIndex: 10 })
    );

    expect(stateAfterMove).toEqual(initialState);
  });

  test('очищает конструктор', () => {
    const mockBun = {
      _id: '123',
      id: 'bun-id',
      name: 'Тестовая булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 150,
      price: 100,
      image: 'bun.png',
      image_mobile: 'bun-mobile.png',
      image_large: 'bun-large.png',
    };

    const mockIngredient = {
      ...mockBun,
      _id: '456',
      id: 'ingredient-id',
      name: 'Тестовая начинка',
      type: 'main',
    };

    const stateWithBun = constructorReducer(undefined, addIngredient(mockBun));

    const stateWithIngredients = constructorReducer(
      stateWithBun,
      addIngredient(mockIngredient)
    );

    const stateAfterClear = constructorReducer(stateWithIngredients, clearConstructor());

    expect(stateAfterClear).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
