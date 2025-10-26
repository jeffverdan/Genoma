
import { useRouter } from 'next/router';
import { ArrConflitosType } from "@/interfaces/IA_Recibo";
import Check from "@mui/icons-material/Check";
import imovelDataInterface from '@/interfaces/Imovel/imovelData'
import { Alert, Chip, Paper } from '@mui/material';
import Pessoa from "@/interfaces/Users/userData";
import CardEmails from "./@CardEmails";
import CardDataEscritura from "./@DataEscritura";
// import { useForm } from "react-hook-form";
import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue, UseFormWatch, UseFormSetError, UseFormSetFocus } from "react-hook-form";
import FormValuesType from "@/interfaces/EntregarVenda";

import FormValues from '@/interfaces/Vendas/EntregarVenda'
import SwitchWithLabel from "@/components/SwitchButton";
import { use, useEffect, useState } from "react";
import InputSelect from "@/components/InputSelect/Index";
import { HiExclamationCircle } from "react-icons/hi2";
import RowRadioButtonsGroup from "@/components/RadioGroup";
import EmptyTextarea from "@/components/TextArea";
import GetListBancos from "@/apis/getListBancos";
import SaveEntregarVenda from '@/apis/postSaveEntregarVenda';
import SaveTopicosGerente from '@/apis/saveTopicosGerente';
import getSaveTopicos from '@/apis/getSaveTopicos';
import CardTestemunhas from './CardTestemunhas';
import { Step } from 'react-joyride';
import OnboardingJoyride from '@/components/Onboarding_Joyride';

interface PropsType {
    imovelData: imovelDataInterface,
    setImovelData: (e: imovelDataInterface) => void,
    refreshScreen: Boolean,
    setRefreshScreen: (e: Boolean) => void
    // onCheckIAMistake: (e: React.ChangeEvent<HTMLInputElement>) => void
    // onClickEdit: () => void
    // type: "imóvel" | "vendedores" | "compradores" | 'venda'
    // checked_IA: boolean
    // checked_edit: boolean

    register: UseFormRegister<FormValues>
    errors: FieldErrors<FormValues>
    watch: UseFormWatch<FormValues>
    setError: UseFormSetError<FormValues>
    setValue: UseFormSetValue<FormValues>
    setFocus: UseFormSetFocus<FormValues>
    clearErrors: UseFormClearErrors<FormValues>
};

export default function EntregarVenda(props: PropsType) {
    const { imovelData, setImovelData, refreshScreen, setRefreshScreen, register, errors, watch, setError, setValue, setFocus, clearErrors } = props;
    const router = useRouter();
    const [switchReforco, setSwitchReforco] = useState(false);
    const [listBancos, setListBancos] = useState([{ id: '0', label: 'Selecione...' }]);
    const [listRespChaves, setListRespChaves] = useState({
        label: '',
        list: [{ id: '0', label: 'Selecione...' }]
    });
    const [radioOptions, setRadioOptions] = useState([
        { value: '15', label: 'Após as certidões', checked: false, disabled: false },
        { value: '16', label: 'Outro período', checked: false, disabled: false },
    ]);
    const [onboarding, setOnboarding] = useState(false);

    const [reforco, setReforco] = useState({
        card_id: '',
        id: '',
        topico_id: 5,
        processo_id: imovelData?.processo_id || '',
        subtopico_id_tipo: '15',
        obs_reforco: '',
    });

    const [chaves, setChaves] = useState({
        card_id: '',
        id: '',
        topico_id: 2,
        processo_id: imovelData?.processo_id || '',
        subtopico_id_tipo: '',
        subtopico_id_vendedor: '',
        banks_id: ''
    });

    const getList = async () => {
        const list: any = await GetListBancos() || [];
        list.unshift({ id: '0', label: 'Selecione...' });
        setListBancos(list);
    };

    let count = 0;
    useEffect(() => {
        if (count < 1) {
            count += 1
            getList();
            setTimeout(() => {
                setOnboarding(true)
            }, 500)
        }
    }, []);

    useEffect(() => {
        if (imovelData?.informacao?.forma_pagamento_nome) {
            returnRespLabel(imovelData?.informacao?.forma_pagamento_nome);
        }
    }, [imovelData]);

    const returnRespLabel = (formaPagamento: string) => {
        formaPagamento = formaPagamento.toLowerCase();

        if (formaPagamento.includes('vista')) {
            const newList = [{ id: '0', label: 'Selecione...' }];
            imovelData?.vendedores?.forEach((vendedor) => {
                newList.push({ id: vendedor.id.toString(), label: (vendedor.name || vendedor.razao_social) || '' });
            })
            setListRespChaves({ label: 'Vendedor responsável*', list: newList });
        } else if (formaPagamento.includes('financiado')) {
            setListRespChaves({ label: 'Instituição financeira*', list: listBancos });
        } else if (formaPagamento.includes('consórcio')) {
            setListRespChaves({ label: '', list: [] });

        } else if (formaPagamento.includes('fgts')) {
            setListRespChaves({ label: 'Instituição financeira*', list: listBancos });
        }
    };

    useEffect(() => {
        if (imovelData) {
            returnTopicos()
            setValue('prazo_escritura', imovelData.informacao?.prazo);
            setValue('data_assinatura', imovelData.informacao?.data_assinatura);
        }
    }, [imovelData])

    // console.log('WATCH: ' , watch())
    // console.log('Errors: ' , errors)

    const autoSaveData = () => {
        console.log(watch());
        SaveEntregarVenda(watch())
    };

    const autoSaveTopicos = async (value: string, name: string) => {
        const topicoId = name === 'id_responsavel_chaves' ? '2' : '5';

        const data = {
            forma_pagamento_avista: listRespChaves.label === 'Vendedor responsável*',
            topico_id: topicoId,
            subtopico_id_tipo: topicoId === '5' ? value : '',
            processo_id: imovelData.processo_id || '',
            id: topicoId === '5' ? reforco.id : chaves.id,
            card_id: topicoId === '5' ? reforco.card_id : chaves.card_id,
            id_responsavel_chaves: topicoId === '2' ? value : '',
            obs_reforco: topicoId === '5' ? watch('reforco_observacao') : ''
        };

        const res = await SaveTopicosGerente(data);
        if (res) returnTopicos();
    };

    const returnTopicos = async () => {
        const topicosSave = await getSaveTopicos(imovelData?.processo_id || '') as any;
        const topicoReforco = topicosSave.find((e: any) => e.topico_id === 5);
        const topicoChaves = topicosSave.find((e: any) => e.topico_id === 2);

        if (topicoReforco) {
            setValue('reforco', topicoReforco.momentoReforco || '');
            setSwitchReforco(true);
            setValue('reforco_observacao', topicoReforco.observacaoReforco || '');
            setReforco({
                card_id: topicoReforco.card_id,
                id: topicoReforco.id_vinculo_card,
                topico_id: 5,
                processo_id: imovelData.processo_id || '',
                subtopico_id_tipo: topicoReforco.momentoReforco,
                obs_reforco: topicoReforco.observacaoReforco,
            })
        } if (topicoChaves) {
            setValue('id_responsavel_chaves', topicoChaves.vendedorResponsavel?.toString() || topicoChaves.bancoResponsavel || '');
            setChaves({
                card_id: topicoChaves.card_id,
                id: topicoChaves.id_vinculo_card,
                topico_id: 2,
                processo_id: imovelData.processo_id || '',
                subtopico_id_tipo: '',
                subtopico_id_vendedor: topicoChaves.vendedorResponsavel || '',
                banks_id: topicoChaves.bancoResponsavel || '',
            })
        }
    };

    const steps: Step[] = [
        {
            target: '.card-emails',
            content: 'Cheque os e-mails e edite se for necessário, para garantir que todos recebam o link do DocuSign para assinatura.',
            placement: 'left',
            title: 'Confirme os e-mails',
        },
        {
            target: '.btn-edit',
            content: 'Revise e atualize as informações restantes sobre esta venda.',
            placement: 'left',
            title: 'Revise os dados',
        },
        {
            target: '.card-testemunhas',
            content: 'Informe quem são as testemunhas dessa venda',
            placement: 'left',
            title: 'Testemunhas',
        },
    ];

    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        // FUNÇÃO PARA SCROLLAR A PAGINA PARA O TOPO
        if (stepIndex < steps.length) {
            console.log(stepIndex);
            const className = steps[stepIndex]?.target;
            const element = document.querySelector(className as string);
            console.log(element);
            if (element) {                
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [stepIndex]);


    return (
        <div className="content-entregar">
            {onboarding &&
                <OnboardingJoyride steps={steps} setIndexProps={setStepIndex} disableScrolling  />
            }

            {imovelData?.informacao?.recibo_type === 'docusign' &&
                <>
                    <CardEmails
                        imovelData={imovelData}
                        setImovelData={setImovelData}
                        register={register}
                        errors={errors}
                        watch={watch}
                        clearErrors={clearErrors}
                        setError={setError}
                        autoSaveData={autoSaveData}
                        setValue={setValue}
                        setFocus={setFocus}
                        refreshScreen={refreshScreen}
                        setRefreshScreen={setRefreshScreen}
                    />

                    <CardTestemunhas
                        imovelData={imovelData}
                        setImovelData={setImovelData}
                        register={register}
                        errors={errors}
                        watch={watch}
                        clearErrors={clearErrors}
                        setError={setError}
                        autoSaveData={autoSaveData}
                        setValue={setValue}
                        setFocus={setFocus}
                        refreshScreen={refreshScreen}
                        setRefreshScreen={setRefreshScreen}
                    />
                </>
            }
            <CardDataEscritura
                register={register}
                errors={errors}
                watch={watch}
                clearErrors={clearErrors}
                setError={setError}
                autoSaveData={autoSaveData}
                setValue={setValue}
            />

            <Paper className="card-entregar" elevation={1}>
                <h4>O Recibo de Sinal inclui informações sobre reforço?</h4>
                <SwitchWithLabel label={'Sim, haverá reforço.'} width="217px" check={switchReforco} setCheck={setSwitchReforco} />
                {switchReforco &&
                    <>
                        <RowRadioButtonsGroup
                            label={''}
                            name={'reforco'}
                            options={radioOptions}
                            setOptions={setRadioOptions}
                            setValue={setValue}
                            value={watch('reforco')}
                            changeFunction={(e) => autoSaveTopicos(e, 'reforco')}
                        />

                        {watch('reforco') === '16' &&
                            <EmptyTextarea
                                minRows={2}
                                value={watch('reforco_observacao')}
                                placeholder={'Ex: Ocorrerá durante a entrega das chaves ao comprador...'}
                                label={'Descreva o período que está especificado no Recibo de Sinal:'}
                                {...register("observacao", {
                                    onChange: (e) => setValue('reforco_observacao', e.target.value),
                                    onBlur: () => autoSaveTopicos(watch('reforco') || '', 'reforco')
                                })}

                            />
                        }
                    </>
                }

            </Paper>

            <Paper className="card-entregar" elevation={1}>
                <h4>Quem está responsável pelas chaves do imóvel?</h4>
                <Alert className="alert info" icon={<HiExclamationCircle size={22} />}>
                    A forma de pagamento definida no cadastro do imóvel foi <b>{imovelData?.informacao?.forma_pagamento_nome.replace(', ', ' + ').toLowerCase()}</b>.
                </Alert>

                {!!listRespChaves.list[1] ?
                    <InputSelect
                        label={listRespChaves.label}
                        option={listRespChaves.list}
                        sucess={Number(watch('id_responsavel_chaves')) > 0}
                        error={!!errors?.id_responsavel_chaves}
                        msgError={errors?.id_responsavel_chaves}
                        value={watch('id_responsavel_chaves') || '0'}
                        // onBlurFunction={(e) => onBlur('forma_contato', e)}
                        {...register('id_responsavel_chaves', {
                            required: true,
                            // required: errorMsg,
                            validate: (value) => {
                                if (value === '0') {
                                    return 'Campo obrigatório';
                                }
                            },
                            onChange: (e) => autoSaveTopicos(e.target.value, e.target.name)
                        })}
                    />
                    : <p>O responsável pelas chaves será a DNA Imóveis.</p>
                }
            </Paper>

        </div>
    )

}