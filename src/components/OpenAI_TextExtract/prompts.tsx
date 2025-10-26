const promptRecibo = (`
        Texto que vou enviar é um Recibo de sinal de uma venda de imovel digitalizado e scaneado,
        podendo ser mais de 1 vendedor e mais de 1 comprador,
        CLÁUSULA PRIMEIRA trata do imovel que está sendo negociado,
        foi feito um OCR para transformar em texto,
        as páginas podem ou não estar em ordem,
        pode haver erros de português, se houver, corrija-os antes de ler,
        pode haver os seguintes tipos de laudemios: "União, Prefeitura, Família, Igreja",
        laudemio de União pode ser chamado apenas de União ou RIP exemplo "RIP nº" ou  "União nº" mas o retorno esperado é "União",
        laudemio de União deve ter junto do seu retono o numero que é seu complemento,
        laudemio de Prefeitura não tem complemento,
        laudemio de Família pode ter os seguintes complementos: "Burle de Figueredo, Ely Jose Machado, Koening, Moçapyr, Orleans e Bragança, Regis de Oliveira, Silva Porto",
        laudemio de Igreja pode ter os seguintes complementos: "Mosteiro de São Bento, Irmandade do Santíssimo Sacramento da Candelária, Hospital dos Lazáros"
        a partir dessas informações retone em JSON os seguintes parametros: 
        {
            "vendedores": [{
                nome: '',
                cpf: '',
                estado_civil: '',
                regime_casamento: se o mesmo for casado retornar se encontrar o regime de casamento,
                nome_mae: se não encontrar retornar 'Não informado',
                nome_pai: se não encontrar retornar 'Não informado',
            }],
            "compradores": [{
                nome: '',
                cpf: '',
                estado_civil: '',
                regime_casamento: se o mesmo for casado retornar se encontrar o regime de casamento,
                nome_mae: se não encontrar retornar 'Não informado',
                nome_pai: se não encontrar retornar 'Não informado',
            }],
            "imovel": {
                logradouro: '',
                numero: '',
                unidade: '',
                bairro: '',
                uf: '',
                inscricao_municipal: '',
            },
            "documento_valido": o documento é um recibo de sinal? true ou false,
            "tipo_escritura": forma de escritura que o imovel foi adquirido pelos vendedores,
            "valor_venda": valor total da venda do imovel em formato 'R$ X.XXX,XX',
            "prazo_escritura": prazo em dias que será assinada o instrumento particular com força de escritura,
            "data_recibo": retorne no formato DD/MM/AAAA a data do documento encontrada perto das assinaturas,
            "imovel_com_laudemio": leia todo o texto e determine true se o imóvel tem Foro e false se não,
            "foreiro": [{
                tipo: '',
                complemento: '',
            }],             
        }
`);


const promptVendedores = `
        Os dados a seguir devem ser retirados do texto, 
        e apenas do adquirente que pode ser mais de uma pessoa,
        pessoa fisica ou juridica, 
        retorne em JSON:
        "dados": [{
            nome: '', 
            pessoa_juridica: true se for pessoa juridica e false se for pessoa fisica,
            cpf: se for pessoa fisica numero do cpf formatado,
            cnpj: se for pessoa juridica numero do cnpj formatado,
            data_nascimento: retorne se houver retornar a data de nascimento no formato DD/MM/AAAA pode ter mais de uma data então tenha cuidado para não pegar a data errada,
            telefone: retorne se houver retornar o numero do telefone no formato com DDD,
            rg: se houver retornar o numero do RG,
            rg_expedido: retorne se houver retornar o nome do orgão que expediu o RG,
            rg_data_expedicao: retorne se houver retornar a data em que foi expedido o RG no formato DD/MM/AAAA,
            estado_civil: retorne apenas os valores: '1' para Casado(a) ou '2' para Solteiro(a) ou '3' para Divorciado(a) ou '4' para Viúvo(a) ou '0' para nenhuma das opções anteriores,
            uniao_estavel: retorne true se houver união estável ou false se não,
            conjuge: retorne o nome do conjugue apenas se o estado_civil dessa pessoa for Casado ou Divorciado ou Viúvo,
            regime_casamento: retorne 1 para separação total ou 2 para separação parcial ou 3 para separação legal ou 4 para comunhão de bens ou 5 para comunhão parcial ou 0 se não encontrar a informação,
        }]: 
        segue o texto: 
    `;

const promptOnusReais = `        
        O texto que vou enviar deveria ser referente a um Registro Geral de Imóvel,
        ele consiste de registros que são paragrafos iniciandos da letra R ou AV seguida de um numeral, exemplo: "R-1/" ou "R.1/",
        o ultimo registro é o que tiver o maior numeral e é independente da posição no texto,
        documento é composto de varias paginas, 
        foi feito um OCR, 
        as páginas podem ou não estar em ordem,
        pode haver erros de português, se houver, corrija-os antes de ler,
        a partir dessas informações retorne os parametros em JSON:
        {
            "rgi": true se o texto for de um REGISTRO DE IMÓVEIS ou false se for qualquer outro assunto,
            "matricula_imovel": retorne a matricula do imovel referente,        
            "imovel_com_laudemio": leia os registros e determine true se o imóvel tem Foro e false se não,        
            "foreiro": se houver foro retorne o proprietário do terreno,        
            "ultimo_registro_AV": paragrafo de registro que tenha o maior numeral entre todos os registros independente da posição no texto e que começe com a letra AV,
            "ultimo_registro": paragrafo de registro que começe com a letra R e que tenha o maior numeral entre todos os registros independente da posição no texto
        },
        segue o texto:
    `;


export { promptRecibo, promptVendedores, promptOnusReais };