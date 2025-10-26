const extenso = require('extenso');

const logicaGenero = (tipo: string, dadosUsuarios: any[] | undefined, letra: any) => {
    if (!dadosUsuarios) return ''
    let genero = '';
    const arrayGenero: string[] = [];
    dadosUsuarios.forEach((element: { genero: any; }) => {
        arrayGenero.push(element.genero);
    });

    if (arrayGenero.includes("M") || arrayGenero.includes("")) {
        switch (letra) {
            case 'or':
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'ES'
                    } else {
                        genero = 'es'
                    }
                } else {

                }

                break;
            case 'o':
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'OS'
                    } else {
                        genero = 'os'
                    }
                } else {
                    if (tipo === 'maiusculo') {
                        genero = 'O'
                    } else {
                        genero = 'o'
                    }
                }
                break;
            case 'ao':
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'AOS'
                    } else {
                        genero = 'aos'
                    }
                } else {
                    if (tipo === 'maiusculo') {
                        genero = 'AO'
                    } else {
                        genero = 'ao'
                    }
                }
                break;
            default:
                break;
        }

    } else {
        switch (letra) {
            case 'ao':
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'ÀS'
                    } else {
                        genero = 'às'
                    }
                } else {
                    if (tipo === 'maiusculo') {
                        genero = 'À'
                    } else {
                        genero = 'à'
                    }
                }
                break;
            default:
                if (dadosUsuarios.length > 1) {
                    if (tipo === 'maiusculo') {
                        genero = 'AS'
                    } else {
                        genero = 'as'
                    }
                } else {
                    if (tipo === 'maiusculo') {
                        genero = 'A'
                    } else {
                        genero = 'a'
                    }
                }
                break;
        }
    }
    return genero;
};

function retornoEstadoCivil(estado_civil: string | null, registro_casamento: string, uniao_estavel: string | null, valor_conjuge: string | null, genero: string) {
    let estado = '';
    let regime = "";
    let uniao = "";
    let conjuge = "";
    if (estado_civil !== null && estado_civil !== '') {
        switch (estado_civil) {
            case "1":
                estado = (genero === "F") ? "casada," : "casado,";
                regime = " pelo regime de ";
                conjuge = " com " + valor_conjuge;
                switch (registro_casamento) {
                    case "1":
                        regime += "Separação total de bens";
                        break;
                    case "2":
                        regime += "Separação parcial de bens";
                        break;
                    case "3":
                        regime += "Separação legal de bens";
                        break;
                    case "4":
                        regime += "Comunhão de bens";
                        break;
                    case "5":
                        regime += "Comunhão parcial de bens";
                        break;

                    default:
                        break;
                }
                break;
            case "2":
                estado = (genero === "F") ? "solteira" : 'solteiro';
                break;
            case "3":
                estado = (genero === "F") ? "divorciada" : "divorciado";
                break;
            case "4":
                estado = (genero === "F") ? "viúva" : "viúvo";
                break;

            default:
                break;
        }

        if (uniao_estavel === "S") {
            uniao = ", união estavel"
            conjuge = " com " + valor_conjuge;
        }
        
        return estado + regime + uniao + conjuge;
    } else {
        return '';
    }
};


function formatoPorExtenso(valor: string | null) {

    console.log(valor);

    let retornoPorExtenso = '................';
    if (valor !== null) {
        valor = valor.replace(/R\$/g, '');
        valor = valor.replace(/\./g, '').replace(/\,/g, '.');

        console.log(valor)

        let valorInteiro: string | number = Math.floor(Number(valor));
        const valorDecimal = Math.round((Number(valor) - valorInteiro) * 100);
        retornoPorExtenso = extenso(valorInteiro || 0, { mode: 'currency', currency: { type: 'BRL' } });

        console.log(valorInteiro)
        console.log(valorDecimal)


        if (valorDecimal > 0) {
            const returnDecimal = extenso(valorDecimal);
            retornoPorExtenso += ` e ${returnDecimal} centavos`;
        }
    };

    return retornoPorExtenso.trim();
};

const formatNumber = (value: string | null | undefined) => {
    if (!value) return 0;
    return Number((value.replace(/[R$.]+/g, '')).replace(",", "."));
};

export { logicaGenero, retornoEstadoCivil, formatoPorExtenso, formatNumber };