const cepMask = (v: string) => {
    if(!v) return "";
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/(\d{5})(\d)/,'$1-$2'); //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}

export default cepMask;