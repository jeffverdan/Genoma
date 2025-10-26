function convertReal(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '0,00';

    // Se já for número, só formatar
    if (typeof value === 'number') {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Remove tudo que não for número ou vírgula/ponto
    let valorLimpo = value.toString().replace(/[^0-9.,]/g, '');

    // Se vier no formato brasileiro (tem vírgula e ponto)
    if (valorLimpo.match(/^\d{1,3}(\.\d{3})*,\d{2}$/)) {
        // Troca ponto por nada e vírgula por ponto para virar float
        valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
    } else if (valorLimpo.match(/^\d+(\.\d{2})$/)) {
        // Formato americano: 3000.00
        // Nada a fazer, já está correto
    } else if (valorLimpo.match(/^\d+,\d{2}$/)) {
        // Formato brasileiro sem milhar: 3000,00
        valorLimpo = valorLimpo.replace(',', '.');
    }

    const numero = parseFloat(valorLimpo);

    if (isNaN(numero)) return '0,00';

    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default convertReal;