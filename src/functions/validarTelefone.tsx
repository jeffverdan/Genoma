const validarTelefone = (phone: string) => {
    if (!phone) return false;
    
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem 10 ou 11 dígitos
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        return false;
    }
    
    // Verifica se o DDD é válido (11 a 99)
    const ddd = parseInt(cleanPhone.substring(0, 2));
    if (ddd < 11 || ddd > 99) {
        return false;
    }
    
    // Se for celular (11 dígitos), deve começar com 9
    if (cleanPhone.length === 11) {
        const ninthDigit = cleanPhone.charAt(2);
        if (ninthDigit !== '9') {
            return false;
        }
    }
    
    // Verifica se não são todos os dígitos iguais
    const allSameDigits = cleanPhone.split('').every((digit: any) => digit === cleanPhone[0]);
    if (allSameDigits) {
        return false;
    }
    
    return true;
};
export default validarTelefone;