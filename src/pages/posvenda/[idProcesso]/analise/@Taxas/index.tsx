import { Chip, SelectChangeEvent } from '@mui/material';
import InputSelect from '@/components/InputSelect/Index';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
import { ChangeEvent, ReactNode } from 'react';
import InputText from '@/components/InputText/Index';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';

interface Props {
    processData?: ProcessType
    lists?: ApiTopicosAnaliseType
    selects: SelectsType
    setSelects: (e: SelectsType) => void
}

const arrPontosAtencao = [
    { id: 11, chip: 'TAXA DE INCÊNDIO (funesbom) ATRASADA', text: 'Emissão - Boleto de quitação no site da FUNESBOM' },
    { id: 12, chip: 'dívidas de iptu"', text: 'Emissão - Guia para pagamento do IPTU' },
    { id: 13, chip: '9o Distribuidor de Execuções Fiscais', text: 'Emissão - Certidão do 9º Distribuidor de Execuções Fiscais' },
]

const Taxas = ({ lists, selects, setSelects, processData }: Props) => {
    console.log(selects);

    const onChange = (e: any[]) => {
        selects.pendencia = e;
        setSelects({ ...selects });
    };

    return (
        <>
            <div className='cards'>
                <h2>Insira os dados da Inscrição municipal do imóvel</h2>
                <InputText name='inscricao_municipal' label={'Inscrição municipal*'} value={processData?.imovel.informacao?.inscricaoMunicipal || ''} disabled />
                <MultipleSelectCheckmarks
                    label={`Pendências*`}
                    name={'pendencia'}
                    options={lists?.tipos.lista_imovel_pendencia_taxa || []}
                    value={selects?.pendencia || []}
                    // error={error?.[checkType]?.reviews?.[index]?.errorCheck}
                    onChange={onChange}
                    labelMenu={`Tipos de averbações`}
                    // maxWidth={300}
                    placeholder='Selecione...'
                />
            </div>
            
            {selects?.pendencia?.[0] &&
                <div className='cards'>
                    <p>Itens importantes que merecem sua atenção:</p>
                    {arrPontosAtencao.map((e) => (
                        selects?.pendencia?.some(pendencia => pendencia.id === e.id) &&
                        <>
                            <Chip className='chip primary' label={e.chip} />
                            <li className='bold'>{e.text}</li>
                        </>
                    ))}
                </div>
            }
        </>
    )
}

export default Taxas;