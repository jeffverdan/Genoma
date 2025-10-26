const phoneMask = (value: string) => {
    if (!value) return '';
    
    // Remove todos os caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');
    
    // Aplica máscara baseada no tamanho
    if (cleanValue.length <= 10) {
        // Telefone fixo: (11) 1234-5678
        return cleanValue.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
        // Celular: (11) 91234-5678
        return cleanValue.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
};
export default phoneMask;