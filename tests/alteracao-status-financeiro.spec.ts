import { log } from 'console';
import { test, expect } from '@playwright/test';
import { login } from './utils/login.spec';

test('Alteração de Status Financeiro', async ({ page }) => {
    await login(page, { email: 'financeiro@teste.dnaimoveis.rio.br', pass: '321456' });

    // Clica no botão opções no primeiro item da lista de comissões
    await page.click('.actions button:has-text("Opções")');

    // Clica no item "Ver status" da lista
    await page.click('.MuiList-root .MuiMenuItem-root:has-text("Ver status")');

    // Aguarda carregar nova página de status
    await expect(page).toHaveURL(/.*status/);

    // Clica no botão 'Alterar Status'
    await page.click('button:has-text("Alterar status")');

    // Aguarda carregar nova página de status
    await expect(page).toHaveURL(/.*alterar/);

    // Verifica se o select carregou a API com a lista de status
    await page.click('.card-status .inputContainer .MuiSelect-select');
    await page.waitForSelector('.MuiPaper-root .MuiMenuItem-root');
    const statusSelect = await page.locator('.MuiPaper-root .MuiMenuItem-root');
    log('Status disponíveis:', await statusSelect.allTextContents());
    const statusCount = await statusSelect.count();
    log('Número de status disponíveis:', statusCount);
    expect(statusCount).toBeGreaterThan(0);    

    // Seleciona um status clicando na opção de value: 7 "Pago"    
    await page.click('.MuiPaper-root .MuiMenuItem-root:has-text("Pago")');
    await page.fill('textarea[name="observacao"]', 'Alteração de status para teste automatizado');

    // Confirma a alteração
    await page.click('button:has-text("Atualizar status")');

    // Verifica o redirecionamento
    await expect(page).toHaveURL(/.*financeiro.*/);
});