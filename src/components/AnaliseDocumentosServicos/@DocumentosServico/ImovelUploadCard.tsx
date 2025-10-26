import CheckBox from '@/components/CheckBox'
import React, { useState, useEffect } from 'react'
import { useForm, UseFormRegister, UseFormWatch, UseFormSetValue, UseFormClearErrors, UseFormSetError, FieldErrors, UseFormGetValues } from 'react-hook-form'
import { ApiTopicosAnaliseType } from '@/interfaces/PosVenda/Analise';
import InputSelect from '@/components/InputSelect/Index';
import UploadDocumentos from '@/components/UploadDocumentos';
import GetListaDocumentos from '@/apis/getListaDocumentos';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import { ImovelData } from '@/types/ImovelData';
import { FormValues, Usuario } from '@/interfaces/Nucleo/formValue';
import ButtonComponent from '@/components/ButtonComponent';
import { Add, Remove } from '@mui/icons-material';

type Props = {
  register: UseFormRegister<FormValues>
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
  clearErrors: UseFormClearErrors<FormValues>
  setError: UseFormSetError<FormValues>
  errors: FieldErrors<FormValues>
  getValues: UseFormGetValues<FormValues>
  type: string;
  checked?: boolean
  lists?: ApiTopicosAnaliseType
  processData?: ProcessType
  listaDocumentos: []
  dadosNucleo?: IDadosNucleo
  expandedSection: { type: 'vendedores' | 'compradores' | 'imovel' | null; index: number | null };
  setExpandedSection: React.Dispatch<React.SetStateAction<{ type: 'vendedores' | 'compradores' | 'imovel' | null; index: number | null }>>;
}

interface IDadosNucleo {
  documentos_imovel?: any[],
  documentos_comprador?: any[],
  documentos_vendedor?: any[],
  contador_identidade_comprador?: number,
  contador_identidade_vendedor?: number,
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

export default function ImovelUploadCard({
  dadosNucleo,
  listaDocumentos,
  processData,
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
  setExpandedSection
}: Props) {
  const [checkImovel, setCheckImovel] = useState(checked);
  const [multiDocs, setMultiDocs] = useState<any>([]);
  const errorMsg = 'Campo obrigatório';

  const servicoId = dadosNucleo?.dados_servico?.servico_id || '';

  const context = {
    dataProcesso: processData?.imovel as ImovelData,
    idProcesso: processData?.imovel?.processo_id || '',
    multiDocs, setMultiDocs,
  }

  const handleCheckImovel = (type: string, e: any) => {
    const check = e.target.checked;
    setCheckImovel(check)
  }

  const refreshDocs = () => {
    const documentos = dadosNucleo?.documentos_imovel?.map((doc: any) => ({
      'id': doc.id || '',
      'file': doc.nome_original?.toString() || doc.arquivo || '',
      'item': !!doc.tipo_documento_ids[0]
        ? doc.tipo_documento_ids.map((items: any) => ({
          'id': items.id || '',
          'values': items.tipo_documento_id || '',
          'validade_dias': items.validade_dias || null,
          'data_vencimento': items.data_vencimento || null,
          'data_emissao': items.data_emissao || null,
          'nome': items.nome_tipo
        }))
        : []
    }))
    documentos && setMultiDocs([...documentos]);
  };

  useEffect(() => {
    refreshDocs();
  }, []);

  const handleCollapseButton = () => {
    setExpandedSection(expandedSection?.type === 'imovel' ? { type: null, index: null } : { type: 'imovel', index: null })
    clearErrors('tipoDocumento')
  }

  return (
    <div className='cards cards-servicos'>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="checkBox">
          <CheckBox
            label={`Documentação do ${type}`}
            value={'1'}
            checked={checkImovel}
            onChange={(e) => handleCheckImovel(type, e)}
          />
        </div>

        { checkImovel &&
          <div className='icon-label actions actions-doc'>
            <ButtonComponent 
                style={{marginBottom: '0'}} 
                size={'large'} 
                variant={'text'} 
                startIcon={expandedSection?.type === 'imovel' ? <Remove/> : <Add/>} 
                label={(expandedSection?.type === 'imovel' ? 'Fechar' : 'Mostrar') + ' Documentos'} 
                onClick={() => handleCollapseButton()} 
            />
          </div>
        }
      </div>

      {checkImovel && (
        <div className="content">
            {expandedSection?.type === 'imovel' && (
                <UploadDocumentos
                    register={register}
                    errors={errors}
                    context={context}
                    pessoa="imovel"
                    idDonoDocumento={processData?.imovel?.id}
                    option={listaDocumentos}
                    servicoId={dadosNucleo?.dados_servico?.servico_id}
                />
            )}
        </div>
      )}
    </div>
  )
}