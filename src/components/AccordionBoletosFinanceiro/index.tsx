import React, {useState, useEffect} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ParcelaProcessoResponse } from '@/interfaces/Financeiro/Status';
import { Alert, Chip, Snackbar } from '@mui/material';
import UploadDocumentos from '@/components/UploadDocumentos';
import { MultiDocsType } from '../UploadDocumentos/Interfaces';
import { useForm } from 'react-hook-form';
import { ItemListRecentsType } from '@/interfaces/Corretores';
import InputText from '../InputText/Index';
import formatoMoeda from '@/functions/formatoMoeda';
import ButtonComponent from '../ButtonComponent';
import dateMask from '@/functions/dateMask';
import { CheckIcon } from '@heroicons/react/24/solid';
import postSaveDadosBoleto from '@/apis/postSaveDadosBoleto';
import Corner from '../Corner';
import DialogPagamentoAtraso from '@/pages/financeiro/[idProcesso]/[idParcela]/status/@componentes/DialogPagamentoAtraso';
import { FaExclamationCircle } from 'react-icons/fa';

type Props = {
  processData: ParcelaProcessoResponse | undefined;
  retunProcess: () => void;
  idResponsavelBoletoEditado: number[] | null
  setIdResponsavelBoletoEditado: React.Dispatch<React.SetStateAction<number[] | null>>;
}

type UseFormType = {
  tipo_nota: string
  valor_boleto: string
  data_envio: string
  data_emissao: string
  data_validade: string
  parcela_id: number | string | null
  usuario_id: number | string | null
  boleto_id?: number | string | null
}

export default function AccordionBoletosFinanceiro({processData, retunProcess, idResponsavelBoletoEditado, setIdResponsavelBoletoEditado} : Props) {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  // console.log('processData accordion: ', processData);
  const [multiDocs, setMultiDocs] = useState<MultiDocsType[]>([]);
  const [res, setRes] = useState<any>();
  const errorMsg = "Campo obrigatório";
  const [addRecibo, setAddRecibo] = useState<boolean>(true)
  const processDataContext: any | ItemListRecentsType | null = processData
  const dataContext: any = {
    dataProcesso: processDataContext,
    idProcesso: processData?.parcela?.processo_id || '',
    multiDocs,
    setMultiDocs,
    setRes
  };
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [nomeCorner, setNomeCorner] = useState<string>('');

  const {
      register,
      watch,
      setValue,
      setError,
      clearErrors,
      reset,
      formState: { errors },
      handleSubmit,
  } = useForm<UseFormType>({
      defaultValues: {
        tipo_nota: '1',
        valor_boleto: '',
        data_envio: '',
        data_emissao: '',
        data_validade: '',
        parcela_id: '',
        usuario_id: '',
        boleto_id: ''
      },
  });

  // Função para extrair o ID do panel expandido
  const getExpandedId = (panelName: string | false): number | null => {
    if (!panelName || typeof panelName !== 'string') return null;
    const match = panelName.match(/panel(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  const refreshDocs = () => {
    setLoading(true);
    
    const expandedId = getExpandedId(expanded);
    
    if (!expandedId) {
      setMultiDocs([]);
      setLoading(false);
      return;
    }

    // Filtra apenas o item do accordion expandido
    const expandedItem = processData?.parcela?.responsaveis_pagamento?.find((usuario: any) => 
      usuario?.id === expandedId
    );

    if (expandedItem) {
      const documentos: any = [{
        id: expandedItem?.boleto_id || '',
        file: String(expandedItem?.nome_boleto || ''),
        item: !!expandedItem?.tipo_documento_id ? [({
          id: expandedItem?.boleto_id || '',
          values: expandedItem?.valor_pagamento || '',
          validade_dias: expandedItem?.data_envio || null,
          data_vencimento: expandedItem?.data_validade || null,
          data_emissao: expandedItem?.data_emissao || null,
          nome: expandedItem?.nome_boleto
        })] : []
      }];
      
      setMultiDocs(documentos);
      setValue('boleto_id', expandedItem?.boleto_id || '');
      setValue('data_envio', expandedItem?.data_envio || '');
      setValue('data_emissao', expandedItem?.data_emissao || '');
      setValue('data_validade', expandedItem?.data_validade || '');
    } else {
      setMultiDocs([]);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    refreshDocs()

    // Se um boleto for removido, o `processData` é atualizado.
    // Este effect verifica se algum dos IDs em `idResponsavelBoletoEditado`
    // corresponde a um responsável que não tem mais um boleto.
    // Se não tiver, o ID é removido da lista.
    if (idResponsavelBoletoEditado && processData?.parcela?.responsaveis_pagamento) {
      const responsaveisComBoleto = new Set(
        processData.parcela.responsaveis_pagamento
          .filter(r => r.boleto_id != null)
          .map(r => r.usuario_id)
      );
      setIdResponsavelBoletoEditado((prev: any) => {
        if (!prev) return null;
        const filtered = prev.filter((id: number) => responsaveisComBoleto.has(id));
        return filtered.length > 0 ? (filtered as number[]) : null;
      });
    }
  }, [expanded, processData, loading]);

  // console.log('MULTIDOCS: ', multiDocs)
  // console.log('EXPANDED ID: ', getExpandedId(expanded))

  const handleChange = (panel: string, id: number | null) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (isExpanded) {
        setExpanded(panel);
        const responsavel = processData?.parcela?.responsaveis_pagamento.find(r => r.id === id);

        // Popula o formulário com os dados do accordion aberto
        setValue('valor_boleto', responsavel?.valor_pagamento || '');
        setValue('data_envio', responsavel?.data_envio || '');
        setValue('data_emissao', responsavel?.data_emissao || '');
        setValue('data_validade', responsavel?.data_validade || '');
        setValue('usuario_id', responsavel?.usuario_id || '');
        setValue('parcela_id',  processData?.parcela?.id || '');
        setValue('boleto_id', responsavel?.boleto_id || '');

        setNomeCorner(responsavel?.usuario_nome || '');

    } else {
        setExpanded(false);
        // Limpa o formulário quando o accordion é fechado
        reset({
          tipo_nota: '1',
          valor_boleto: '',
          data_envio: '',
          data_emissao: '',
          data_validade: '',
          parcela_id: '',
          usuario_id: '',
          boleto_id: ''
        });
    }

    clearErrors('valor_boleto');
    clearErrors('data_envio');
    clearErrors('data_emissao');
    clearErrors('data_validade');
  };

  // console.log('WATCH: ', watch());

  const handleSave = async (data: any) => {
    console.log('DATA: ', data);
    // console.log('WATCH: ', watch());

    const resp = await postSaveDadosBoleto(data);

    if(resp){
      // Sucesso
      retunProcess();

      const usuarioId = Number(data.usuario_id);
      setIdResponsavelBoletoEditado((prev) => {
        const currentIds = prev || [];
        // Adiciona o ID apenas se ele não existir no array
        if (!currentIds.includes(usuarioId)) {
          return [...currentIds, usuarioId];
        }
        // Se já existir, retorna o array sem modificação
        return prev;
      });
    }
  }
  console.log('ID RESPONSAVEL BOLETO EDITADO: ', idResponsavelBoletoEditado);

  return (
    <div style={{width: '100%'}} className={'card-accordion'}>
      {
        processData?.parcela.responsaveis_pagamento.map((data, index) => (
          <Accordion 
            key={data?.id} 
            className={`card-accordion-boleto-info`} 
            expanded={expanded === `panel${data?.id}`}
            onChange={handleChange(`panel${data?.id}`, data?.id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography component="span" sx={{ width: '100%', flexShrink: 0 }}>
                <div className="header-accordion">
                  <Chip 
                    label={`${data?.boleto_id && data?.data_emissao && data?.data_validade && data?.data_envio ? 'enviado' : 'pendente'}`} 
                    className={`chip ${data?.boleto_id && data?.data_emissao && data?.data_validade && data?.data_envio ? 'secondary400' : 'red500'}`} 
                  /> 
                  {/* <Chip label={`${processData?.parcela?.quantidade_parcela === 1 ? 'integral' : 'parcela ' +  processData?.parcela?.quantidade_parcela + '/' + processData?.parcela?.numero_parcela}`} className={`chip neutral500`}/>  */}
                  <span className="nome">{data?.usuario_nome}</span>
                </div>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {
                  !loading && expanded === `panel${data?.id}` &&
                    <>
                      <UploadDocumentos
                        context={dataContext}
                        pessoa={data?.papel === 'Vendedor' ? 'vendedores' : 'compradores'}
                        idDonoDocumento={String(data?.usuario_id) || ''}
                        register={register}
                        errors={errors}
                        origem="financeiro"
                        option={[{
                            id: 61,
                            nome: 'boleto_financeiro',
                            tipo: data?.papel === 'Vendedor' ? 'pessoa fisica vendedor' : 'pessoa fisica comprador',
                            validade_dias: null
                        }]}
                        refresh={retunProcess}
                        setAddRecibo={setAddRecibo}
                    />
                    
                    <div className="info-accordion">
                      <div className="row">
                          <InputText 
                            label="Valor*"
                            placeholder="R$ 0,00"
                            msgError={errors.valor_boleto}
                            error={!!errors.valor_boleto?.message}
                            sucess={!!watch('valor_boleto')}
                            value={watch('valor_boleto')}
                            disabled={data?.boleto_id ? false : true}
                            {...register('valor_boleto', {
                                required: 'Valor é obrigatório',
                                setValueAs: (value) => formatoMoeda(value),
                            })}
                          />
                      </div>  

                      <div className="row">
                          <InputText 
                            label="Data de Envio*"
                            placeholder="dd/mm/aaaa"
                            type="text"
                            inputProps={{ maxLength: 10 }}
                            msgError={errors.data_envio}
                            error={!!errors.data_envio?.message}
                            sucess={!!watch('data_envio')}
                            value={watch('data_envio')}
                            disabled={data?.boleto_id ? false : true}
                            {...register('data_envio', {
                                required: 'Data é obrigatória',
                                onChange: (e) => {
                                    setValue('data_envio', dateMask(e.target.value));
                                },
                            })}
                          />
                      </div>  

                      <div className="row">
                          <InputText 
                            label="Data de Emissão*"
                            placeholder="dd/mm/aaaa"
                            type="text"
                            inputProps={{ maxLength: 10 }}
                            msgError={errors.data_emissao}
                            error={!!errors.data_emissao?.message}
                            sucess={!!watch('data_emissao')}
                            value={watch('data_emissao')}
                            disabled={data?.boleto_id ? false : true}
                            {...register('data_emissao', {
                                required: 'Data é obrigatória',
                                onChange: (e) => {
                                    setValue('data_emissao', dateMask(e.target.value));
                                },
                            })}
                          />
                      </div>  

                      <div className="row">
                          <InputText 
                            label="Data de Validade*"
                            placeholder="dd/mm/aaaa"
                            type="text"
                            inputProps={{ maxLength: 10 }}
                            msgError={errors.data_validade}
                            error={!!errors.data_validade?.message}
                            sucess={!!watch('data_validade')}
                            value={watch('data_validade')}
                            disabled={data?.boleto_id ? false : true}
                            {...register('data_validade', {
                                required: 'Data é obrigatória',
                                onChange: (e) => {
                                    setValue('data_validade', dateMask(e.target.value));
                                },
                            })}
                          />
                      </div>  
                    </div> 

                    <div>
                      {
                        watch('valor_boleto') === '' || 
                          watch('data_envio').length < 10 || 
                          watch('data_emissao').length < 10 || 
                          watch('data_validade').length < 10 || 
                          !data?.boleto_id 
                            ? '' 
                            : <Alert className='alert yellow yellow-msg' variant="filled" icon={<FaExclamationCircle size={20} />} sx={{ width: '100%' }}>
                                Verifique se os dados estão corretos antes de salvar.
                              </Alert>
                      }
                    </div>

                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                      <ButtonComponent
                        variant='contained'
                        label='Salvar edição'
                        labelColor='white'
                        size='large'
                        disabled={
                          watch('valor_boleto') === '' || 
                          watch('data_envio').length < 10 || 
                          watch('data_emissao').length < 10 || 
                          watch('data_validade').length < 10 || 
                          !data?.boleto_id ? true : false
                        }
                        startIcon={<CheckIcon width={20} height={20} fill={'#fff'} />}
                        onClick={handleSubmit(async (data) => {
                          handleSave(data)
                        })}
                      />
                    </div>             
                  </>  
                }
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      }

      <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
          <Alert className='alert info' onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
              Os dados do boleto de <span>{nomeCorner}</span>, foram atualizados com sucesso.
          </Alert>
      </Snackbar>
    </div>
  );
}