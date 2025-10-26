const dateMask = (v: string) => {    
    if (!v) return "";
    v = v.replace(/\D/g, ""); //Substituí o que não é dígito por "", /g é [Global][1]
    v = v.replace(/(\d{2})(\d)/, "$1/$2");
    v = v.replace(/(\d{2})(\d)/, "$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1");

    return v
}

export default dateMask;