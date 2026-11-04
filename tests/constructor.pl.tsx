import { test, expect } from '@playwright/test';

test.describe('add ingredients to constructor works correctly', function () {
  test.beforeEach(async ({ page }) => {
    await page.route('https://norma.education-services.ru/api/**', (route) =>
      route.abort()
    );
  });

  test('главная страница открывается и загружает ингредиенты', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      update: false,
      notFound: 'abort',
      url: 'https://norma.education-services.ru/api/ingredients',
    });

    await page.goto('/');

    await expect(page).toHaveURL('http://localhost:4000/');

    await expect(page.getByText('Соберите бургер')).toBeVisible();
    await expect(
      page.getByText('Краторная булка N-200i', { exact: true })
    ).toBeVisible();
  });

  test('добавление булки в конструктор', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      update: false,
      notFound: 'abort',
      url: 'https://norma.education-services.ru/api/ingredients',
    });

    await page.goto('/');

    const bun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByText('Добавить').click();

    await expect(bun.locator('.counter__num')).toHaveText('2');

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });
    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(constructor.getByText('Краторная булка N-200i (низ)')).toBeVisible();
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      update: false,
      notFound: 'abort',
      url: 'https://norma.education-services.ru/api/ingredients',
    });
    await page.goto('/');
    const filling = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await filling.getByText('Добавить').click();
    const constructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });
    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
  });

  test('открытие модального окна ингредиента и закрытие по крестику', async ({
    page,
  }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      update: false,
      notFound: 'abort',
      url: 'https://norma.education-services.ru/api/ingredients',
    });
    await page.goto('/');
    const bun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bun.getByText('Краторная булка N-200i').click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('Белки, г')).toBeVisible();
    await expect(page.getByText('Жиры, г')).toBeVisible();
    await expect(page.getByText('Углеводы, г')).toBeVisible();
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();
  });

  test('закрытие модального окна по Escape', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      update: false,
      notFound: 'abort',
      url: 'https://norma.education-services.ru/api/ingredients',
    });
    await page.goto('/');
    const bun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bun.getByText('Краторная булка N-200i').click();
    const modalTitle = page.getByRole('heading', {
      name: 'Детали ингредиента',
    });
    await expect(modalTitle).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modalTitle).not.toBeVisible();
  });

  test('закрытие модального окна по оверлею', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      update: false,
      notFound: 'abort',
      url: 'https://norma.education-services.ru/api/ingredients',
    });
    await page.goto('/');
    const bun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bun.getByText('Краторная булка N-200i').click();
    const modalTitle = page.getByRole('heading', {
      name: 'Детали ингредиента',
    });
    await expect(modalTitle).toBeVisible();
    await page.locator('[class*="overlay"]').click({
      position: { x: 10, y: 10 },
    });
    await expect(modalTitle).not.toBeVisible();
  });

  test('авторизация с мокированным пользователем', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      update: false,
      notFound: 'abort',
      url: 'https://norma.education-services.ru/api/ingredients',
    });

    await page.routeFromHAR('tests/hars/order.har', {
      update: false,
      notFound: 'abort',
      url: /https:\/\/norma\.education-services\.ru\/api\/(auth\/user|orders)$/,
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Оформить заказ' })).toBeVisible();

    await page.getByRole('link', { name: 'Тестовый пользователь' }).click();
    await expect(page).toHaveURL(/\/profile/);
  });

  test('создание заказа', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      update: false,
      notFound: 'abort',
      url: 'https://norma.education-services.ru/api/ingredients',
    });

    await page.routeFromHAR('tests/hars/order.har', {
      update: false,
      notFound: 'abort',
      url: /https:\/\/norma\.education-services\.ru\/api\/(auth\/user|orders)$/,
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    // Убеждаемся, что пользователь авторизован
    await expect(
      page.getByRole('link', { name: 'Тестовый пользователь' })
    ).toBeVisible();

    // Добавляем булку
    const bun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByText('Добавить').click();

    // Добавляем начинку
    const filling = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await filling.getByText('Добавить').click();

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Проверяем номер заказа из HAR
    await expect(page.getByText('12345')).toBeVisible();

    const constructor = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });

    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);

    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByText('12345')).not.toBeVisible();
  });
});
