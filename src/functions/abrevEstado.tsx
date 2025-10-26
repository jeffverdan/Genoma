const estadosBrasil = [
    { label: "Acre", abrev: "AC" },
    { label: "Alagoas", abrev: "AL" },
    { label: "Amapá", abrev: "AP" },
    { label: "Amazonas", abrev: "AM" },
    { label: "Bahia", abrev: "BA" },
    { label: "Ceará", abrev: "CE" },
    { label: "Distrito Federal", abrev: "DF" },
    { label: "Espírito Santo", abrev: "ES" },
    { label: "Goiás", abrev: "GO" },
    { label: "Maranhão", abrev: "MA" },
    { label: "Mato Grosso", abrev: "MT" },
    { label: "Mato Grosso do Sul", abrev: "MS" },
    { label: "Minas Gerais", abrev: "MG" },
    { label: "Pará", abrev: "PA" },
    { label: "Paraíba", abrev: "PB" },
    { label: "Paraná", abrev: "PR" },
    { label: "Pernambuco", abrev: "PE" },
    { label: "Piauí", abrev: "PI" },
    { label: "Rio de Janeiro", abrev: "RJ" },
    { label: "Rio Grande do Norte", abrev: "RN" },
    { label: "Rio Grande do Sul", abrev: "RS" },
    { label: "Rondônia", abrev: "RO" },
    { label: "Roraima", abrev: "RR" },
    { label: "Santa Catarina", abrev: "SC" },
    { label: "São Paulo", abrev: "SP" },
    { label: "Sergipe", abrev: "SE" },
    { label: "Tocantins", abrev: "TO" }
  ]; 

export default function abrevEstado (state: string) {
    if(state.length < 3) return state;
    const abrev = estadosBrasil.find(e => e.label.toLowerCase() === state.toLowerCase())?.abrev; 
    return abrev || state;
}