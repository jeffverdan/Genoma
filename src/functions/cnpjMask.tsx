function cnpjMask(v:any) {
    if(!v) return "";
    v = v.replace(/\D/g, "")
    v = v.replace(/(\d{2})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d)/, "$1/$2")
    v = v.replace(/(\d{4})(\d)/, "$1-$2")                //Remove tudo o que não é dígito
    //de novo (para o segundo bloco de números)
    v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/);
    return v
}

export default cnpjMask;