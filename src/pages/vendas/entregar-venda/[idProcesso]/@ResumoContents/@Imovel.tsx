import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import { Link, Paper } from '@mui/material';
import ShowDocument from '@/apis/getDocument';

interface propsCampo {
  title: string
  subtitle: string | number | undefined
};

const Campo = (props: propsCampo) => {  
  return (
    <div>
      <p className='title'>{props.title}</p>
      <p className='subtitle'>{props.subtitle}</p>
    </div>
  )
};

const ResumoImovel = ({ imovelData }: { imovelData: imovelDataInterface }) => {
  console.log(imovelData);  

  return (
    <div className='resumo-imovel'>
      <Paper className='paper codigo'>
        <h4>Código do imóvel</h4>
        <div className='row'>
          <Campo title='Código do imóvel' subtitle={imovelData?.codigo} />
        </div>
      </Paper>

      <Paper className='paper endereco'>
        <h4>Endereço do Imóvel</h4>
        <div className='row'>
          <Campo title='CEP' subtitle={imovelData?.cep} />
          <Campo title='Logradouro' subtitle={imovelData?.logradouro} />
        </div>

        <div className='row'>
          <Campo title='Número' subtitle={imovelData?.numero || '---'} />
          <Campo title='Unidade' subtitle={imovelData?.unidade || '---'} />
          <Campo title='Complemento' subtitle={imovelData?.complemento || '---'} />
        </div>

        <div className='row'>
          <Campo title='Cidade' subtitle={imovelData?.cidade} />
          <Campo title='Estado' subtitle={imovelData?.uf} />
          <Campo title='Bairro' subtitle={imovelData?.bairro} />
        </div>
      </Paper>

      <Paper className='paper escritura'>
        <h4>Registro e Escritura</h4>
        <div className='row'>
          <Campo title='Escritura' subtitle={imovelData?.informacao?.tipo_escritura || '---'} />
          <Campo title='Vagas escrituradas' subtitle={imovelData?.informacao?.vaga || '---'} />
        </div>

        <div className='row'>
          <Campo title='Matrícula nº' subtitle={imovelData?.informacao?.matricula || '---'} />
          <Campo title='Inscrição Municipal' subtitle={imovelData?.informacao?.inscricaoMunicipal || '---'} />
          <Campo title='RGI' subtitle={imovelData?.informacao?.rgi || '---'} />
        </div>

        <div className='row'>
          <Campo title='Lavrada em' subtitle={imovelData?.informacao?.lavrada || '---'} />
          <Campo title='Livro' subtitle={imovelData?.informacao?.livro || '---'} />
          <Campo title='Folha' subtitle={imovelData?.informacao?.folha || '---'} />
          <Campo title='Ato' subtitle={imovelData?.informacao?.ato || '---'} />
        </div>
      </Paper>

      <Paper className='paper laudemio'>
        <h4>Laudêmio</h4>
        <div className='row'>
          {imovelData?.laudemios?.[0] ? <Campo title='Quantidade' subtitle={imovelData?.laudemios?.length} /> : "Nenhum laudêmio cadastrado" }
        </div>
        {imovelData?.laudemios?.map((laudemio) => (
          <div className='row' key={laudemio.id}>
            <Campo title='Tipo' subtitle={laudemio.nameTipo} />
            {!!laudemio.valorName && <Campo title={laudemio.labelTipo} subtitle={laudemio.valorName} />}
          </div>
        ))}
      </Paper>

      <Paper className='paper valores'>
        <h4>Valores</h4>
        <div className='row'>
          <Campo title='Valor anunciado' subtitle={imovelData?.informacao?.valor_anunciado} />
          <Campo title='Valor de venda' subtitle={imovelData?.informacao?.valor_venda} />
          <Campo title='Valor de sinal' subtitle={imovelData?.informacao?.valorSinal} />
        </div>

        <div className='row'>
          <Campo title='Forma de pagamento' subtitle={imovelData?.informacao?.forma_pagamento_nome} />
          <Campo title='Meio de pagamento' subtitle={"?"} />
        </div>
      </Paper>

      <Paper className='paper prazo'>
        <h4>Prazo da escritura e multa</h4>
        <div className='row'>
          <Campo title='Prazo para Escritura' subtitle={imovelData?.informacao?.prazo} />
        </div>

        <div className='row'>
          <Campo title='Valor da multa diária' subtitle={imovelData?.informacao?.valoMulta || 'R$ 0,00'} />
        </div>
      </Paper>

      <Paper className='paper clausulas'>
        <h4>Cláusulas</h4>
        <div className='row'>
          <Campo title='Cláusula segunda' subtitle={imovelData?.informacao?.excecoes || '---'} />
        </div>

        <div className='row'>
          <Campo title='Cláusula décima' subtitle={imovelData?.informacao?.bens_moveis || '---'} />
        </div>
      </Paper>

      <Paper className='paper documentos'>
        <h4>Documentos do imóvel</h4>
        {imovelData?.imovel?.documentos?.filter((e) => e.identifica_documento === 'imóvel' || e.identifica_documento === 'imovel').map((doc) => (
          <div className='row' key={doc.id}>
            <Campo title='Tipo' subtitle={doc.tipo_documento_ids?.map((e) => " " + e.nome_tipo).toString()} />            
            <div>
              <p className='title'>Nome do documento</p>
              <Link className='link' onClick={() => ShowDocument(doc.id, 'documento')} >{doc.nome_original}</Link>
            </div>
          </div>
        ))}
        {imovelData?.imovel?.documentos?.length === 0 && "Nenhum documento cadastrado"}
      </Paper>

    </div>
  )
}

export default ResumoImovel;