export default function clearFiltersLocal() {
    // SENDO CHAMADO EM, LOGIN.TSX E FILTERS/INDEX
    localStorage.removeItem('filtro_endereco');
    localStorage.removeItem('filtro_gerente');
    localStorage.removeItem('filtro_responsavel');
    localStorage.removeItem('filtro_status');
    localStorage.removeItem('filtro_status_rascunho');
    localStorage.removeItem('filtro_pagamento');
    localStorage.removeItem('filtro_recibo');
    localStorage.removeItem('filtro_correcoes');
    localStorage.removeItem('filtro_laudemio');
};