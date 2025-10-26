import InputSelect from '@/components/InputSelect/Index'
import React, { useEffect, useState } from 'react'
import getListStatus from '@/apis/getListStatus'
import { Alert, CircularProgress, Skeleton } from '@mui/material';
import { FaExclamationCircle } from 'react-icons/fa';
import TextArea from '@/components/TextArea';
import { useForm, UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import ButtonComponent from '@/components/ButtonComponent';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/solid';
import { DataToSave, FormValues, Visualizar } from '@/interfaces/PosVenda/AlterarStatus';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import GetListTopicos from '@/apis/getListTopicosAnalise';
import { ApiTopicosAnaliseType, SelectsType } from '@/interfaces/PosVenda/Analise';
import ApiAlterarStatus from '@/apis/AlterarStatus';
import InputText from '@/components/InputText/Index';
import dateMask from '@/functions/dateMask';
import getSaveTopicos from '@/apis/getSaveTopicos';
import DialogAlterarStatus from '@/components/DialogTrocaStatus';

type CompradoresListType = {
    id: number | string
    nome: string
    tipo_pessoa: number
}[]
import BancoDocumentacao from './@BancoDocumentacao';
import Escritura from './@Escritura';
import ITBI from './@ITBI';
import Registro from './@Registro';
import Laudemio from './@Laudemio';
import Engenharia from './@Engenharia';
import Taxas from './@Taxas';
import Averbacao from './@Averbacao';

interface IListaStatus {
    id: string | number,
    label: string
}
interface IHistoricoStatus {
    dias_corridos: string;
    historico_status: {
        id: number | string,
        status_id: number,
        data: string;
        data_expiracao: string;
        nome: string;
        status: string;
    }[];
    verifica_data: string;
}

interface Props {
    processData?: ProcessType
    statusAtual: string
    returnHistoricoStatus: () => void
    setNewStatus: (e: boolean) => void
    setOpenDialogStatus: (e: boolean) => void
    arrTopics?: SelectsType[]
    cardSelect: Visualizar
    setCardSelect: (e: Visualizar) => void
    historicoStatus?: IHistoricoStatus
}

export default function AlterarStatus({ processData, statusAtual, returnHistoricoStatus, setNewStatus, setOpenDialogStatus, arrTopics, cardSelect, setCardSelect, historicoStatus }: Props) {
    console.log(processData);
    
    const errorMsg = 'Campo obrigatório';    
    const [listaStatus, setListaStatus] = useState<IListaStatus[]>([]);
    const [openCards, setOpenCards] = useState(false);
    const [statusSelecionado, setStatusSelecionado] = useState<number>();
    const [loading, setLoading] = useState(false);
    const [lists, setLists] = useState<ApiTopicosAnaliseType>();
    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        reset,
        formState: { errors },
        handleSubmit,
    } = useForm<DataToSave>({
        defaultValues: {
            gerente_id: processData?.gerente.data[0]?.id,
            status_processo_id: cardSelect?.status_id || '',
            data_escritura: cardSelect?.data_expiracao || '',
            mensagem: '',

            // Engenharia
            banco: cardSelect?.engenharia?.[0]?.banco_id.toString() || '',
            data_engenharia: cardSelect?.engenharia?.[0]?.data_engenharia || '',
            hora_engenharia: cardSelect?.engenharia?.[0]?.hora_engenharia || '',
            check_engenharia: cardSelect?.engenharia?.[0]?.check_engenharia === 1 ? true : false || false,

            // Banco e Documentação
            check_banco: {
                doc_vendedor:  cardSelect?.banco_documentos?.[0]?.doc_vendedor === 1 ? true : false || false,
                doc_comprador: cardSelect?.banco_documentos?.[0]?.doc_comprador === 1 ? true : false || false,
                doc_imovel: cardSelect?.banco_documentos?.[0]?.doc_imovel === 1 ? true : false || false
            },

            // ITBI e Taxas
            responsavel_comprador: cardSelect?.responsaveis_venda?.[0]?.comprador_id || '',
            responsavel_vendedor: cardSelect?.responsaveis_venda?.[0]?.vendedor_id || '',
            // pendencia_taxa: cardSelect?.pendencias || [],

            // AVERBAÇÃO
            // vendedores_averb: cardSelect

            // Escritura
            hora_escritura: cardSelect?.escritura?.hora_escritura || '',
            local_escritura: cardSelect?.escritura?.cartorio_id || '',
            nome_cartorio: cardSelect?.escritura?.local_escritura || '',
            cep_escritura: cardSelect?.escritura?.cep || '',
            endereco_escritura: cardSelect?.escritura?.logradouro || '',
            numero_escritura: cardSelect?.escritura?.numero || '',
            unidade_escritura: cardSelect?.escritura?.unidade || '',
            complemento_escritura: cardSelect?.escritura?.complemento || '',
            cidade_escritura: cardSelect?.escritura?.cidade || '',
            estado_escritura: cardSelect?.escritura?.uf || '',
            bairro_escritura: cardSelect?.escritura?.bairro,

            // Registro
            check_registro: cardSelect?.registro?.check_registro === 1 ? true : false || false,
            tipo_rgi: cardSelect?.registro?.tipo_rgi_id || '',
            protocolo_rgi: cardSelect?.registro?.protocolo_rgi || ''
            
        }
    });

    // console.log('WATCH:' , watch())
    // console.log('processData: ', processData)
    // console.log('CARDSELECT ALTERAR STATUS', cardSelect)
    // console.log('CARDSELECT PENDENCIAS: ' , cardSelect?.pendencias);

    const returnListStatus = async () => {        
        if (processData) {            
            const quantVendedores = processData.vendedores.length;
            const optionQuant = [
                { id: '', name: 'Selecione...' },
                { id: 1, name: 1 },
            ];
            for (let i = 2; i <= quantVendedores; i++) {
                optionQuant.push({ id: i, name: i })
            } // LOGICA PARA LISTA DE QUANTIDADE DE VENDEDORES (AVERBAÇÃO);

            const compradores_envolvidos: CompradoresListType = processData.compradores.map((e) => ({
                id: e.id || '',
                nome: e.name || e.razao_social || '',
                tipo_pessoa: e.tipo_pessoa
            }))
            compradores_envolvidos.unshift({ id: '', nome: 'Selecione o comprador responsável', tipo_pessoa: 0 })

            const resLists = await GetListTopicos(processData.imovel.processo_id || '') as unknown as ApiTopicosAnaliseType;
            setLists({
                ...resLists,
                quantVendedores: optionQuant,
                compradores_envolvidos
            });

            // const topics = await getSaveTopicos(processData.imovel.processo_id || '') as unknown as SelectsType[];
            // setArrTopics(topics);
        }
    };

    useEffect(() => {
        const removerIds: any[] = [1, 2, 7, 27];
        if(processData) setListaStatus([{ id: '', label: 'Selecione...' }, ...processData?.lista_status?.filter((data) => !removerIds?.includes(data.id))]);
    },[processData]);

    useEffect(() => {
        returnListStatus();
        const paramsId = localStorage.getItem('params');
        if(paramsId) {
            setValue('status_processo_id', Number(paramsId));
            onChangeSelect(paramsId);
            localStorage.removeItem('params');
        };
    }, []);

    // console.log('LISTS STATUS:' , lists)

    const onChangeSelect = (e: any) => {
        const value = e.target ? e.target.value : e;
        setStatusSelecionado(value)

        // OBSERVAÇÃO DO GERENTE
        setValue('mensagem', '');

        if(cardSelect.status_id !== value){
            setValue('data_escritura', '');
        }
        else{
            setValue('data_escritura', cardSelect.data);
            clearErrors('data_escritura');
        }

        // // ENGENHARIA
        // setValue('check_engenharia', false);
        // setValue('data_engenharia', '');
        // setValue('hora_engenharia', '');
        // setValue('banco', '');

        // // ESCRITURA
        // setValue('nome_cartorio', '');
        // setValue('local_escritura', '');
        // setValue('data_escritura', '');
        // setValue('hora_escritura', '');
        // setValue('cep_escritura', '');
        // setValue('endereco_escritura', '');
        // setValue('unidade_escritura', '');
        // setValue('complemento_escritura', '');
        // setValue('cidade_escritura', '');
        // setValue('complemento_escritura', '');
        // setValue('estado_escritura', '');
        // setValue('bairro_escritura', '');

        // // ITBI
        // setValue('responsavel_comprador', '');

        // Limpar Erros]
        clearErrors('banco');
        clearErrors('data_engenharia');
        clearErrors('hora_engenharia');
        clearErrors('responsavel_comprador');

        setOpenCards(true);
    };

    const handleInput = async (type: string, e: any) => {
        if (type === 'mensagem') setValue(type, e);
        // console.log('OBSERVACAO: ', watch('mensagem'))
    };

    const onSaveNewStatus = async (e: FormValues) => {
        if (processData) {
            const enderecoProcesso = `${processData?.imovel.logradouro}${processData?.imovel.numero ? ', ' + processData?.imovel.numero : ''}${processData?.imovel.bairro ? ' - ' + processData?.imovel.bairro : ''}`
            e.processo_id = processData.imovel.processo_id || '';
            e.processo_nome = enderecoProcesso;
            const res = await ApiAlterarStatus(e);
            // console.log(res);
            if (res) {
                setOpenDialogStatus(true);
                setOpenCards(false);
                setNewStatus(false);
                returnHistoricoStatus();
            }
        }
    };

    return (
        <div className='new-status-container'>
            {/* <SelectStatus statusAtual={statusAtual} /> */}
            <div className='cards'>
                <h2>Em qual status o processo vai entrar?</h2>
                <Alert
                    className='alert info'
                    icon={<FaExclamationCircle size={20} />}
                    severity='warning'
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {
                        statusAtual
                        ?
                        <>O processo está em <span style={{ fontWeight: 700, color: '#5D696F' }}>{statusAtual}</span>.</>
                        :
                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '250px' }} />    
                    }
                    {/* O processo está em <span style={{ fontWeight: 700, color: '#5D696F' }}>{statusAtual}</span> <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80px' }} />. */}
                </Alert>

                <div className="selects-line">
                    {
                        statusAtual
                        ?
                        <InputSelect
                            option={listaStatus}
                            label={'Status*'}
                            placeholder={'Selecione'}
                            error={!!errors.status_processo_id ? true : false}
                            msgError={errors.status_processo_id}
                            required={true}
                            sucess={!errors.status_processo_id && !!watch('status_processo_id')}
                            value={watch('status_processo_id') || ''}
                            {...register('status_processo_id', {
                                validate: (value) => {
                                    if (value === '') {
                                        return "Nenhum status foi selecionado";
                                    }
                                },
                                required: errorMsg,
                                onChange: onChangeSelect
                            })}
                            inputProps={{ 'aria-label': 'Without label' }}
                        />
                        :
                        <Skeleton variant="rectangular" sx={{ fontSize: '1rem', width: '441px', height: '82px', borderRadius: '10px' }} />
                    }

                    {(watch('status_processo_id') === 3 || watch('status_processo_id') === 4 || watch('status_processo_id') === 33) &&
                        <InputText
                            label={'Previsão de entrega*'}
                            placeholder={'Ex: dd/mm/aaaa'}
                            sucess={!errors.data_escritura && watch('data_escritura')?.length === 10}
                            error={!!errors.data_escritura ? true : false}
                            msgError={errors.data_escritura}
                            value={watch('data_escritura')}
                            inputProps={{
                                maxlength: 10,
                            }}
                            {...register('data_escritura', {
                                required: errorMsg,
                                setValueAs: (e: string) => dateMask(e),
                                validate: (value?: string) => value?.length === 10 || "Data inválida",
                                onChange: (e: any) => handleInput('data_escritura', e.target.value)
                            })}
                        />}

                </div>
            </div>

            {
                (openCards || watch('status_processo_id')) &&
                <>
                    {   // CARD ENGENHARIA
                        (statusSelecionado === 30 || watch('status_processo_id') === 30) &&
                        <Engenharia
                            handleInput={handleInput}
                            register={register}
                            watch={watch}
                            errors={errors}
                            setValue={setValue}
                            topics={arrTopics?.find(e => e.topico_id === 2)}
                            cardSelect={cardSelect}
                        />
                    }

                    {   // CARD TAXAS
                        (statusSelecionado === 4 || watch('status_processo_id') === 4) /*&& lists*/ &&
                        <Taxas
                            register={register}
                            watch={watch}
                            errors={errors}
                            processData={processData}
                            setValue={setValue}
                            lists={lists}
                            topics={arrTopics?.find(e => e.topico_id === 4)} 
                            cardSelect={cardSelect}
                            historicoStatus={historicoStatus}
                        />
                    }

                    {   // CARD AVERBAÇÂO
                        (statusSelecionado === 21 || watch('status_processo_id') === 21) &&
                        <Averbacao
                            register={register}
                            watch={watch}
                            errors={errors}
                            processData={processData}
                            setValue={setValue}
                            lists={lists}
                            topics={arrTopics?.find(e => e.topico_id === 1)}
                            historicoStatus={historicoStatus}
                        />
                    }

                    {   // CARD BANCO E DOCUMENTAÇÃO
                        (statusSelecionado === 29 || watch('status_processo_id') === 29) &&
                        <BancoDocumentacao
                            handleInput={handleInput}
                            register={register}
                            watch={watch}
                            errors={errors}
                            setValue={setValue}
                            cardSelect={cardSelect}
                        />
                    }

                    {   // CARD ESCRITURA
                        (statusSelecionado === 5 || watch('status_processo_id') === 5 && statusAtual) &&
                        <Escritura
                            handleInput={handleInput}
                            register={register}
                            watch={watch}
                            errors={errors}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            setError={setError}
                        />
                    }

                    {   // CARD ITBI
                        (statusSelecionado === 28 || watch('status_processo_id') === 28) &&
                        <ITBI
                            handleInput={handleInput}
                            register={register}
                            watch={watch}
                            errors={errors}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            setError={setError}
                            processData={processData}
                        />
                    }

                    {   // CARD REGISTRO
                        (statusSelecionado === 6 || watch('status_processo_id') === 6) &&
                        <Registro
                            handleInput={handleInput}
                            register={register}
                            watch={watch}
                            errors={errors}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            setError={setError}
                            processData={processData}
                            cardSelect={cardSelect}
                        />
                    }

                    {   // CARD TAXAS
                        (statusSelecionado === 33 || watch('status_processo_id') === 33) &&
                        <Laudemio
                            register={register}
                            watch={watch}
                            errors={errors}
                            processData={processData}
                            setValue={setValue}
                        />
                    }

                    <div className='cards'>
                        <h2>Observação para o gerente</h2>
                        <p>As informações colocadas abaixo serão enviadas ao gerente juntamente com<br /> a notificação de mudança de status.</p>

                        {
                            cardSelect.mensagem
                            ?
                                cardSelect?.status_id === watch('status_processo_id')
                                ?
                                <div>
                                    {/* <p><span>Última mensagem desse status compartilhado: </span> {cardSelect?.mensagem}</p> */}
                                    <Alert
                                        className='alert info'
                                        //icon={''}
                                        severity='warning'
                                        variant="filled"
                                        sx={{ width: '100%' }}
                                    >
                                        <span style={{fontWeight: 700}}>Última observação compartilhada: </span> {cardSelect?.mensagem}
                                    </Alert>
                                </div>
                                : 
                                ''
                            :
                            ''
                        }
                        <TextArea
                            label={'Escreva a observação livremente'}
                            minRows={4}
                            placeholder='Digite aqui...'
                            // error={!!errors.descricao}
                            value={watch('mensagem')}
                            {...register("mensagem", {
                                required: false,
                                onChange: (e) => handleInput('mensagem', e.target.value)
                            })}
                        />
                    </div>
                </>
            }



            <footer className='footer-checkout'>
                <ButtonComponent
                    size={'large'}
                    variant={'contained'}
                    label={'Atualizar status e compartilhar com o gerente'}
                    labelColor='white'
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} /> : <ArrowRightIcon width={20} fill='white' />}
                    onClick={handleSubmit((e) => onSaveNewStatus(e))}
                />
            </footer>
        </div>
    )
}
