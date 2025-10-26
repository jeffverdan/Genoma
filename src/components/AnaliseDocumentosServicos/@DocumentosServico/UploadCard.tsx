import React, { useState, useEffect } from 'react';
import CheckBox from '@/components/CheckBox';
import { useForm, UseFormRegister, UseFormWatch, UseFormSetValue, UseFormClearErrors, UseFormSetError, FieldErrors, UseFormGetValues } from 'react-hook-form';
import { ApiTopicosAnaliseType } from '@/interfaces/PosVenda/Analise';
import InputSelect from '@/components/InputSelect/Index';
import UploadDocumentos from '@/components/UploadDocumentos';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import { ImovelData } from '@/types/ImovelData';
import Skeleton from '@mui/lab/Skeleton';
import { FormValues, Usuario } from '@/interfaces/Nucleo/formValue';
import { ListaDocumentosType } from "@/interfaces/Documentos";
import ButtonComponent from '@/components/ButtonComponent';
import { Remove, Add } from '@mui/icons-material';

type Props = {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  clearErrors: UseFormClearErrors<FormValues>;
  setError: UseFormSetError<FormValues>;
  errors: FieldErrors<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  type: string;
  checked: boolean;
  lists?: ApiTopicosAnaliseType;
  listaDocumentos: [];
  setListaDocumentos: (e: []) => void;
  processData?: ProcessType;
  dadosNucleo?: IDadosNucleo;
  expandedSection: { type: 'vendedores' | 'compradores' | 'imovel' | null; index: number | null };
  setExpandedSection: React.Dispatch<React.SetStateAction<{ type: 'vendedores' | 'compradores' | 'imovel' | null; index: number | null }>>;
};

interface IDadosNucleo {
  documentos_imovel?: any[];
  documentos_comprador?: any[];
  documentos_vendedor?: any[];
  contador_identidade_comprador?: number;
  contador_identidade_vendedor?: number;
  dados_servico?: {
    status_servico_id?: number | string;
    status?: string;
    servico_id?: number;
    observacao?: string;
    data_previsao?: string;
    concluir_servico?: number;
    atualizar_servico?: number;
  };
}

export default function UploadCard({
  dadosNucleo,
  processData,
  listaDocumentos,
  setListaDocumentos,
  type,
  checked,
  register,
  getValues,
  watch,
  setValue,
  clearErrors,
  setError,
  errors,
  lists,
  expandedSection,
  setExpandedSection,
}: Props) {
  const [checkVenddores, setCheckVendedores] = useState(checked);
  const [checkCompradores, setCheckCompradores] = useState(checked);
  const [arrQtd, setArrQtd] = useState([]);
  const errorMsg = 'Campo obrigatório';
  const objInicial = { id: '0', name: 'Selecione...', documentos: undefined};
  const [multiDocs, setMultiDocs] = useState<{ [key: string]: any[] }>({});

  const context = {
    dataProcesso: processData as ImovelData,
    idProcesso: processData?.imovel?.processo_id || '',
    multiDocs,
    setMultiDocs,
  };
  const [loadingDocumentos, setLoadingDocumentos] = useState<boolean>(false);
  const [listaVendedores, setListaVendedores] = useState<any[]>([])
  const [listaCompradores, setListaCompradores] = useState<any[]>([])

  useEffect(() => {
    // Quantidade de Compradores e Vendedores
    const qtdCompradores = dadosNucleo?.contador_identidade_comprador || '0';
    const qtdVendedores = dadosNucleo?.contador_identidade_vendedor || '0';
    const quantidadeSelectCompradores = lists?.listaCompradores?.filter((data) => data.id !== '0').length || 0;
    const quantidadeSelectVendedores = lists?.listaVendedores?.filter((data) => data.id !== '0').length || 0;
    const quantidadeSelect: any = type === 'vendedores' ? quantidadeSelectVendedores : quantidadeSelectCompradores;
    setValue('quantidade_compradores', qtdCompradores);
    setValue('quantidade_vendedores', qtdVendedores);

    // Tratando a listagem de Vendedores
    const listagemVendedores = lists?.listaVendedores || [];
    listagemVendedores.unshift(objInicial);
    const newListagemVendedores = Array.from(new Map(listagemVendedores.map(obj => [obj.id, obj])).values());
    setListaVendedores(newListagemVendedores);

    // Tratando a listagem de Compradores
    const listagemCompradores = lists?.listaCompradores || [];
    listagemCompradores.unshift(objInicial);
    const newListagemCompradores = Array.from(new Map(listagemCompradores.map(obj => [obj.id, obj])).values());
    setListaCompradores(newListagemCompradores);

    const array: any = [];
    for (let i = 1; i <= quantidadeSelect; i++) {
      array.push({ id: i.toString(), name: String(i) });
    }
    array.unshift(objInicial);
    setArrQtd(array);

    const processUsuarios = (usuarios: any) => {
      return usuarios.map((usuario: any) => ({
        id: usuario.usuario_id,
        nome: usuario.nome || '',
        documentos: usuario.documentos || [],
      }));
    };

    // Valores para vendedores e compradores
    if (type === 'vendedores') {
      const vendedoresIds: any = processUsuarios(dadosNucleo?.documentos_vendedor);
      setValue('vendedores', vendedoresIds);
    } else if (type === 'compradores') {
      const compradoresIds: any = processUsuarios(dadosNucleo?.documentos_comprador);
      setValue('compradores', compradoresIds);
    }

    clearErrors(type as 'vendedores' | 'compradores');
  }, [dadosNucleo, type, setValue, clearErrors]);

  const handleReferenciaDoc = (type: string, e: any) => {
    const check = e.target.checked;
    if (type === 'vendedores') setCheckVendedores(check);
    else if (type === 'compradores') setCheckCompradores(check);
  };

  const handleQuantidadeUsuarios = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = parseInt(e.target.value);
    const valoresAnteriores = getValues(type as 'vendedores' | 'compradores') || [];

    const novosUsuarios: Usuario[] = [];
    for (let i = 0; i < valor; i++) {
      novosUsuarios.push(
        valoresAnteriores[i] || {
          id: '',
          nome: '',
        }
      );
    }
    setValue(type as 'vendedores' | 'compradores', novosUsuarios);
    clearErrors(type as 'vendedores' | 'compradores');
  };

  const handleMultiDocsChange = (userId: string, docs: any[]) => {
    // console.log('MULTIDOCS: ', docs);
    setMultiDocs((prev) => ({
      ...prev,
      [userId]: docs,
    }));
  };

  const handleVendedoresCompradores = (e: any, index: number, lista: any) => {
    const tipoPessoa = lista[index]?.tipo_pessoa === 0 ? 'fisica' : 'juridica';
    const documentos: any = listaDocumentos?.filter((documento: any) => documento?.tipo.includes(tipoPessoa) || documento?.id === 61) || [];
    // console.log('VENDENDOR: ', lista[index]);
    // console.log('LISTA DE DOCUMENTOS DE VENDEDOR:', documentos);
    setListaDocumentos(documentos);
  };

  const refreshDocs = () => {
    let documentos: any[] = [];
    if (type === 'compradores') {
      documentos = dadosNucleo?.documentos_comprador?.flatMap((usuario: any) =>
        usuario.documentos.map((doc: any) => {
          // console.log('Documento:', doc);
          return {
            id: doc.id || '',
            file: doc.nome_original?.toString() || doc.arquivo || '',
            item: !!doc.tipo_documento_ids[0]
              ? doc.tipo_documento_ids.map((item: any) => ({
                  id: item.id || '',
                  values: item.tipo_documento_id || '',
                  validade_dias: item.validade_dias || null,
                  data_vencimento: item.data_vencimento || null,
                  data_emissao: item.data_emissao || null,
                  nome: item.nome_tipo,
                }))
              : [],
            identifica_documento_id: doc.identifica_documento_id,
          };
        })
      ) || [];
    } else if (type === 'vendedores') {
      documentos = dadosNucleo?.documentos_vendedor?.flatMap((usuario: any) =>
        usuario.documentos.map((doc: any) => {
          // console.log('Documento:', doc);
          return {
            id: doc.id || '',
            file: doc.nome_original?.toString() || doc.arquivo || '',
            item: !!doc.tipo_documento_ids[0]
              ? doc.tipo_documento_ids.map((item: any) => ({
                  id: item.id || '',
                  values: item.tipo_documento_id || '',
                  validade_dias: item.validade_dias || null,
                  data_vencimento: item.data_vencimento || null,
                  data_emissao: item.data_emissao || null,
                  nome: item.nome_tipo,
                }))
              : [],
            identifica_documento_id: doc.identifica_documento_id,
          };
        })
      ) || [];
    }

    if (documentos.length > 0) {
      const updatedMultiDocs = documentos.reduce((acc, doc) => {
        const key = doc.identifica_documento_id || doc.id;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(doc);
        return acc;
      }, {});
      setMultiDocs(updatedMultiDocs);
    }
  };

  useEffect(() => {
    refreshDocs();
  }, [dadosNucleo, type]);

  // console.log('MULTIDOCS COMPRADOR E VENDEDOR: ', multiDocs);

  const handleCollapseButton = (userType: any, index: number) => {
    setExpandedSection(expandedSection?.type === userType && expandedSection?.index === index ? { type: null, index: null } : { type: userType, index })
    clearErrors('tipoDocumento')
  }

  const renderUserSection = (userType: 'compradores' | 'vendedores', checkUser: boolean) => {
    return (
      watch(`quantidade_${userType}`) !== 0 &&
      checkUser &&
      watch(`quantidade_${userType}`) !== 0 &&
      watch(userType)?.map((data: any, index: number) => (
        <React.Fragment key={index}>
          <div className="selects-line" style={{ margin: '30px 0', alignItems: 'center' }}>
            <InputSelect
              label={`${userType === 'vendedores' ? 'Vendedor' : 'Comprador'}*`}
              option={userType === 'vendedores' ? listaVendedores : listaCompradores || []}
              placeholder={`Selecione o ${userType === 'vendedores' ? 'vendedor' : 'comprador'}`}
              error={!!errors[userType]?.[index]?.id}
              msgError={errors[userType]?.[index]?.id}
              required={true}
              value={watch(`${userType}.${index}.id`) || '0'}
              {...register(`${userType}.${index}.id`, {
                validate: (value) => {
                  if (value === 0) {
                    return `Nenhum ${userType === 'vendedores' ? 'vendedor' : 'comprador'} foi selecionado`;
                  }
                },
                required: errorMsg,
                onChange: (e) => {
                  handleVendedoresCompradores(e, index, userType === 'vendedores' ? lists?.listaVendedores : lists?.listaCompradores);
                  setExpandedSection({ type: userType, index });
                },
              })}
            />
            {(String(watch(`${userType}.${index}.id`)) !== '') && (
              <div className='icon-label actions actions-doc'>
                <ButtonComponent 
                  style={{marginBottom: '0'}} 
                  size={'large'} 
                  variant={'text'} 
                  startIcon={expandedSection?.type === userType && expandedSection?.index === index ? <Remove/> : <Add/>} 
                  label={(expandedSection?.type === userType && expandedSection?.index === index ? 'Fechar' : 'Mostrar') + ' Documentos'} 
                  onClick={() => handleCollapseButton(type, index)} 
                />
              </div>
            )}
          </div>

          {expandedSection?.type === userType && expandedSection?.index === index && watch(`${userType}.${index}.id`) && (
            <div className="content">
              {loadingDocumentos === false ? (
                <UploadDocumentos
                  register={register}
                  errors={errors}
                  context={{
                    ...context,
                    multiDocs: multiDocs[String(watch(`${userType}.${index}.id`))] || [],
                    setMultiDocs: (docs: any[]) => handleMultiDocsChange(String(watch(`${userType}.${index}.id`)), docs),
                  }}
                  pessoa={userType}
                  idDonoDocumento={String(watch(`${userType}.${index}.id`))}
                  option={listaDocumentos}
                  servicoId={dadosNucleo?.dados_servico?.servico_id}
                  origem={'nucleo'}
                />
              ) : (
                <Skeleton animation="wave" height={300} />
              )}
            </div>
          )}
        </React.Fragment>
      ))
    );
  };

  return (
    <div className="cards cards-servicos">
      <div className="checkBox">
        <CheckBox
          label={`Documentação ${type === 'imóvel' ? 'do' : 'de'} ${type}`}
          value={type === 'imóvel' ? '1' : type === 'vendedores' ? '2' : '3'}
          checked={type === 'vendedores' ? checkVenddores : checkCompradores}
          onChange={(e) => handleReferenciaDoc(type, e)}
        />
      </div>

      {(checkVenddores || checkCompradores) && (
        <div style={{width: '450px'}}>
          <InputSelect
            label={'Quantidade de ' + type}
            option={arrQtd || []}
            placeholder={'Selecione uma quantidade'}
            error={type === 'vendedores' ? !!errors.quantidade_vendedores : !!errors.quantidade_compradores}
            msgError={type === 'vendedores' ? errors.quantidade_vendedores : errors.quantidade_compradores}
            required={true}
            value={watch(`${type === 'vendedores' ? 'quantidade_vendedores' : 'quantidade_compradores'}`) || '0'}
            {...register(`${type === 'vendedores' ? 'quantidade_vendedores' : 'quantidade_compradores'}`, {
              validate: (value) => {
                if (value === '0') {
                  return 'Nenhuma quantidade foi selecionada';
                }
              },
              required: errorMsg,
              onChange: handleQuantidadeUsuarios,
            })}
          />
        </div>
      )}

      {type === 'vendedores' && renderUserSection('vendedores', checkVenddores)}
      {type === 'compradores' && renderUserSection('compradores', checkCompradores)}
    </div>
  );
}