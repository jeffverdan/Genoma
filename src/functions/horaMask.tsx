const horaMask = (v: string) => {
    v = v.replace(/\D/g, ""); //Substituí o que não é dígito por "", /g é [Global][1]
    v = v.replace(/(\d{2})(\d{2})$/, "$1:$2");
    return v
}

export default horaMask;