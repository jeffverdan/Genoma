const validarEmail = (email: string) => {
    if (!email) return false;
    
    // Regex para validação básica de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Verifica formato básico
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Verifica se não tem espaços
    if (email.includes(' ')) {
        return false;
    }
    
    // Verifica comprimento mínimo e máximo
    if (email.length < 5 || email.length > 254) {
        return false;
    }
    
    // Verifica se a parte local (antes do @) não é muito longa
    const [localPart, domainPart] = email.split('@');
    if (localPart.length > 64) {
        return false;
    }
    
    // Verifica se o domínio tem pelo menos um ponto
    if (!domainPart.includes('.')) {
        return false;
    }
    
    return true;
};
export default validarEmail;