const formatoMoeda = (v?: string) => {
    // UTILIZADO PARA INPUTS DE VALORES MONETÁRIOS

    if (!v) {
        return ''
    }
    if (typeof v === 'string') {
        v = v.replace(/[^\d]/g, '');        
    }
    v = (Number(v) / 100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");

    if (v > '0,00') {
        return 'R$ ' + v;
    }
    else {
        return '';
    }

}

export default formatoMoeda;