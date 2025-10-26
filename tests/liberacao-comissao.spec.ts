import { test, expect } from '@playwright/test';
import { login } from './utils/login.spec';

test('Liberação de Comissão', async ({ page }) => {
    await login(page, { email: 'financeiro@teste.dnaimoveis.rio.br', pass: '321456' });

    // Clica no botão opções no primeiro item da lista de comissões
    await page.click('.actions button:has-text("Opções")');

    // Clica no item "Ver status" da lista
    await page.click('.MuiList-root .MuiMenuItem-root:has-text("Ver status")');

    // Aguarda carregar nova página de status
    await expect(page).toHaveURL(/.*status/);

    // Abre o diálogo de liberação de comissão
    await page.click('button:has-text("Liberar")');

    // Confirma a liberação
    await page.click('button:has-text("Confirmar liberação")');

    // Verifica se a página foi recarregada
    await expect(page).toHaveURL(/.*financeiro.*/);
});