import RadioGroup from '@/components/RadioGroup';
import EmptyTextarea from '@/components/TextArea';
import React, {useState, useEffect} from 'react'
import { useForm, UseFormRegister, UseFormWatch, UseFormSetValue, UseFormClearErrors, UseFormSetError, FieldErrors, UseFormGetValues} from 'react-hook-form'
import UploadCard from './UploadCard';
import InputText from '@/components/InputText/Index';
import dateMask from '@/functions/dateMask';
import { ApiTopicosAnaliseType } from '@/interfaces/PosVenda/Analise';
import PedidosNucleo from '@/interfaces/Nucleo/pedidos';
import ImovelUploadCard from './ImovelUploadCard';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import GetListaDocumentos from '@/apis/getListaDocumentos';
import { FormValues, Usuario } from '@/interfaces/Nucleo/formValue';
import { ListaDocumentosType } from "@/interfaces/Documentos";
import PostRetornaDadosNucleo from '@/apis/postRetornaDadosNucleo';
import Loading from './Loading';


type Props = {
  setActionBtn: (e: boolean) => void;
  register: UseFormRegister<FormValues>
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
  clearErrors: UseFormClearErrors<FormValues>
  setError: UseFormSetError<FormValues>
  errors: FieldErrors<FormValues>
  getValues: UseFormGetValues<FormValues>
  lists?: ApiTopicosAnaliseType
  servicoDetalhado?: PedidosNucleo
  processData?: ProcessType
}

interface IDadosNucleo {
  documentos_imovel?: any[],
  documentos_comprador?: any[],
  documentos_vendedor?: any[],
  contador_identidade_comprador?: number,
  contador_identidade_vendedor?:  number,
  dados_servico?: {
      status_servico_id?: number | string,
      status?: string,
      servico_id?: number,
      observacao?: string,
      data_previsao?: string,
      concluir_servico?: number,
      atualizar_servico?: number
  }
}

export default function DocumentosServico({processData, setActionBtn, register, watch, setValue, getValues, clearErrors, setError, errors, lists, servicoDetalhado} : Props) {
  const [options, setOptions] = useState([
    { value: '1', disabled: false, label: 'Atualizar serviço com previsão de entrega', checked: false },
    { value: '4', disabled: false, label: 'Concluir serviço', checked: false }
  ]);
  const objServico: PedidosNucleo = servicoDetalhado || {} as PedidosNucleo;
  const errorMsg = 'Campo obrigatório';

  const [listaDocumentosImovel, setListaDocumentosImovel] = useState<[]>([]);
  const [listaDocumentos, setListaDocumentos] = useState<[]>([]);
  const [dadosServico, setDadosServico] = useState<IDadosNucleo>();
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<{ type: 'vendedores' | 'compradores' | 'imovel' | null; index: number | null }>({ type: 'imovel', index: null });

  console.log('WATCH: ' , watch());
  console.log('ERRORS: ' , errors);
  console.log('SERVICO DETALHADO: ' , objServico)

  const returnListaDocumentos = async () => {
    // DOCUMENTOS IMÓVEL
    const documentos: any = await GetListaDocumentos();
    const documentosImovel = documentos.filter((documento: any) => documento.tipo === 'imovel' || documento.tipo === 'imóvel' || documento.id === 61);
    setListaDocumentosImovel(documentosImovel);

    // DOCUMENTOS USUÁRIO
    const documentosUsuario = documentos;
    setListaDocumentos(documentosUsuario);
  }

  const returnDadosNucleo = async () => {
    const dataToSave = {
        servico_id: objServico.id,
        processo_id: processData?.imovel?.processo_id
    }

    const data: IDadosNucleo = await PostRetornaDadosNucleo(dataToSave) || {}

    if(data){
      const atualizarServico = data?.dados_servico?.atualizar_servico;
      setValue('dataPrevisao', data?.dados_servico?.data_previsao || '')
      setValue('status_servico', atualizarServico === 1 || 2 || 3 || 5 ? '1' : '4')
      setValue('observacao', data?.dados_servico?.observacao || '')
      setDadosServico(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    returnListaDocumentos();
    returnDadosNucleo();
  }, [])
  
  const handleInput = (type: string, e: any, watch: UseFormWatch<FormValues>) => {
    if(type === 'dataPrevisao'){
      setValue(type, dateMask(watch(type)))
    }
  }

  const handleClear = (e: any) => {
    const value = e;
    if(value === '2'){
      setValue('dataPrevisao', '')
      setValue('quantidade_vendedores', 0)
      setValue('quantidade_compradores', 0)
      setValue('vendedores', [])
      setValue('compradores', [])

      clearErrors('dataPrevisao')
      clearErrors('quantidade_vendedores')
      clearErrors('quantidade_compradores')
      clearErrors('vendedores')
      clearErrors('compradores')
    }
  }

  return (
    <>
    {
      loading
      ? <Loading />
      :
      <div className='new-topic-container'>
        <div className='cards cards-servicos'>
            <h2>Próximos passos: {objServico?.servico_detalhado?.nome}</h2>
            <div>
              <RadioGroup
                value={watch('status_servico')}
                label=''
                options={options}
                setOptions={setOptions}
                setValue={setValue}
                {...register('status_servico', {
                  required: errorMsg,
              })}
              changeFunction={(e) => handleClear(e)}
              />
            </div>
            
            {
              (watch('status_servico') === '1') && 
                <InputText
                  label={'Previsão de entrega'}
                  placeholder={'Ex: dd/mm/aaaa'}
                  sucess={!errors.dataPrevisao && watch('dataPrevisao').length === 10}
                  error={!!errors.dataPrevisao ? true : false}
                  required={true}
                  msgError={errors.dataPrevisao}
                  value={watch('dataPrevisao')}
                  inputProps={{
                    maxlength: 10
                  }}
                  {...register('dataPrevisao', {
                    //required: true,
                    required: errorMsg,
                    setValueAs: e => dateMask(e),
                    validate: (value) => value.length === 10 || "Data inválida",
                    onChange: (e) => handleInput('dataPrevisao',  e.target.value, watch)
                  })}
              />
            }
        </div>

        {
          (watch('status_servico') === '1') && 
            <>
              <div className='cards cards-servicos'>
                  <h2>Realize o upload da documentação </h2>
                  <p>A documentação será de qual grupo?</p>
              </div>

              <UploadCard 
                processData={processData}
                type="vendedores" 
                checked={dadosServico?.contador_identidade_vendedor !== 0 ? true : false}
                register={register}
                watch={watch}
                setValue={setValue}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
                getValues={getValues}
                lists={lists}
                listaDocumentos={listaDocumentos}
                setListaDocumentos={setListaDocumentos}
                dadosNucleo={dadosServico}
                expandedSection={expandedSection}
                setExpandedSection={setExpandedSection}
              />

              <UploadCard 
                processData={processData}
                type="compradores" 
                checked={dadosServico?.contador_identidade_comprador !== 0 ? true : false}
                register={register}
                watch={watch}
                setValue={setValue}
                setError={setError}
                clearErrors={clearErrors}
                errors={errors}
                getValues={getValues}
                lists={lists}
                listaDocumentos={listaDocumentos}
                setListaDocumentos={setListaDocumentos}
                dadosNucleo={dadosServico}
                expandedSection={expandedSection}
                setExpandedSection={setExpandedSection}
              />

              <ImovelUploadCard 
                processData={processData}
                type="imóvel"
                checked={dadosServico?.documentos_imovel?.length ? true : false}
                register={register}
                watch={watch}
                setValue={setValue}
                setError={setError}
                clearErrors={clearErrors}
                getValues={getValues}
                errors={errors}
                listaDocumentos={listaDocumentosImovel}
                dadosNucleo={dadosServico}
                expandedSection={expandedSection} 
                setExpandedSection={setExpandedSection}
              />
            </>
        }
      
        <div className='cards cards-servicos'>
            <h2>Observações para o pós-venda</h2>
            <p>Se necessário, insira observações para que o pós-venda fique atento.</p>
            <EmptyTextarea 
              label={'Observações'}
              minRows={2}
              placeholder={'Ex: Boleto pago e concluído.'}
              value={watch('observacao')}
              {...register('observacao', {
                onChange: (e) => setValue('observacao', e.target.value)
              })}
            />
        </div>
    </div>
    }
    </>
  )
}
function setValue(type: string, arg1: string) {
  throw new Error('Function not implemented.');
}

