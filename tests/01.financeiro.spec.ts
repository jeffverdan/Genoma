import { log } from 'console';
import { test, expect } from '@playwright/test';
import { login } from './utils/login.spec'; // Ajuste o caminho conforme necessário
import { mkdir } from 'fs/promises';

const user = {
    pass:'321456',
    email: 'financeiro@teste.dnaimoveis.rio.br'
};

test('Financeiro acessa dashboard', async ({ page }) => {
    // Reutiliza a função de login
    await login(page, user);
  
    // Verifica se a URL contém a palavra "financeiro"
    try {
      await expect(page).toHaveURL(/.*financeiro.*/);
    } catch (error) {
      // Cria o diretório tests/screenshots se não existir
      await mkdir('tests/screenshots', { recursive: true });
  
      // Captura o screenshot em caso de falha
      await page.screenshot({ path: 'tests/screenshots/financeiro-falha.png' });
      throw error; // Repassa o erro para que o teste seja marcado como falho
    }
  
    // Verifica se o menu Comissões tem 4 abas
    const tabs = await page.locator('.tab-list button');
    log('Número de abas no menu Comissões:', await tabs.count());
    log('Rótulos das abas:', await tabs.allTextContents());
    await expect(tabs).toHaveCount(4);
    const tabLabels = await tabs.allTextContents();
    expect(tabLabels).toEqual(['A receber', 'A pagar', 'Concluídos', 'Cancelados']);
  
    // Verifica se o filtro de endereço carrega a API com a lista de endereços
    const filterEndereco = await page.locator('.autocomplete.endereco .MuiOutlinedInput-input');
    await filterEndereco.click();
    log('Clicou no filtro de endereço');
    const enderecoOptions = await page.locator('.MuiAutocomplete-option.endereco');
    const enderecoCount = await enderecoOptions.count();
    log('Número de opções de endereço:', enderecoCount);     
    expect(enderecoCount).toBeGreaterThan(0);
  
    // Verifica se o filtro de "Gerentes ou Clientes" carrega a API com a lista de gerentes e clientes
    await page.locator('.clientes .MuiInputBase-input').click();
    log('Clicou no filtro de gerentes ou clientes');
    const gerentesClientesOptions = await page.locator('.MuiAutocomplete-listbox .MuiAutocomplete-option');
    const gerentesClientesCount = await gerentesClientesOptions.count();
    log('Número de opções de gerentes ou clientes:', gerentesClientesCount);
    expect(gerentesClientesCount).toBeGreaterThan(0);
  
    // Verifica se a aba "A Receber" contém os filtros: Loja, Tipo e Status Pós-venda
    await page.locator('.tab-list button:has-text("A receber")').click();
    log('Clicou na aba "A receber"');
    await page.locator('.filters .btn-style-menu').click();
    const filters = await page.locator('.content-filters .filter-title');
    const filterLabels = await filters.allTextContents();
    log('Rótulos dos filtros:', filterLabels);
    expect(filterLabels).toContain('Loja');
    expect(filterLabels).toContain('Tipo');
    expect(filterLabels).toContain('Status Pós-venda');

    // Fecha o menu de filtros
    await page.locator('.header-filters .btn-style-undefined').click();
  
    // Verifica se a aba "A Receber" contém as ordenações: Valor da parcela, Data de assinatura, Data prevista
    await page.locator('.filters .btn-style-filter').click();
    const orderBy = await page.locator('.content-filters label');
    const orderByLabels = await orderBy.allTextContents();
    log('Rótulos das ordenações:', orderByLabels);
    expect(orderByLabels).toContain('Valor da parcela');
    expect(orderByLabels).toContain('Data de assinatura');
    expect(orderByLabels).toContain('Data prevista');
  });