import { test, expect } from '@playwright/test';
import { login } from './utils/login.spec';
import path from 'path';

test('Transferência de Rateio', async ({ page }) => {
    await login(page, { email: 'financeiro@teste.dnaimoveis.rio.br', pass: '321456' });

    // Navega entre as abas
    await page.click('text=A pagar');

    // Clica no botão opções no primeiro item da lista de comissões
    await page.click('.actions button:has-text("Opções")');

    // Clica no item "Ver status" da lista
    await page.click('.MuiList-root .MuiMenuItem-root:has-text("Ver status")');

    // Aguarda carregar nova página de status
    await expect(page).toHaveURL(/.*status/);

    // Clica no botão 'Transferir Rateio'
    await page.click('button:has-text("Transferir")');

    // Aguarda carregar pagina de transferencia
    await expect(page).toHaveURL(/.*transferir/);

    // Preenche os campos obrigatórios
    await page.fill('input[name="valor_rateio"]', '1000');

    // Pega data atual
    const today = new Date();
    // Converte para o formato YYYY-MM-DD
    const formattedDate = today.toISOString().split('T')[0]; 

    await page.fill('input[name="data_rateio"]', formattedDate);
    await page.fill('textarea', 'Transferência de teste');

    // Realiza o upload do comprovante de transferência
    const filePath = path.resolve(__dirname, './fixtures/comprovante.pdf'); // Caminho do arquivo de teste
    const fileInput = await page.locator('input[type="file"]'); // Localiza o input de arquivo
    await fileInput.setInputFiles(filePath);

    // Confirma a transferência
    await page.click('button:has-text("Confirmar transferência")');

    // Verifica o redirecionamento
    await expect(page).toHaveURL(/.*financeiro.*/);
});