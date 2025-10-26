import { Page } from '@playwright/test';

type User = {
  email: string;
  pass: string;
};

export async function login(page: Page, user: User): Promise<void> {
  // Acessa a URL de homologação
  await page.goto('http://homolog.genomatech.com.br/');

  // Preenche o campo de e-mail com a variável de ambiente TEST_USER
  await page.fill('input[type="text"]', user.email || '');

  // Preenche o campo de senha com a variável de ambiente TEST_PASS
  await page.fill('input[type="password"]', user.pass || '');

  // Clica no botão de login
  await page.click('[data-testid=btn-login]');
}