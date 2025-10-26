const somenteNumero = (v: string) => {
    v = v.replace(/[^0-9]/g, '');
    return v;
}

export default somenteNumero;