import { Chip } from '@mui/material';
import InputSelect from '@/components/InputSelect/Index';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InputText from '@/components/InputText/Index';
import GetLaudemiosList from '@/apis/getLaudemiosList';
import { LaudemiosListItem } from '@/interfaces/Imovel/laudemiosType';
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import SwitchWithLabel from '@/components/SwitchButton';
import SimpleDialog from '@/components/Dialog';
import LaudemioImage from '@/images/laudemio_nao_cadastrado.svg';
import Image from 'next/image';
import ButtonComponent from '@/components/ButtonComponent';
import EmptyTextarea from '@/components/TextArea';
import { useForm } from 'react-hook-form';
import { SelectsType } from '@/interfaces/PosVenda/Analise';

interface Props {
    processData?: ProcessType
    selects: SelectsType
    setSelects: (e: SelectsType) => void
    onSaveNewTopic: () => void;
};

const optionsQuantLaudemios = [
    { name: 'Selecione...', id: '' },
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
    { id: 4, name: 4 },
];

const tiposLaudemios = [
    { name: 'União, Prefeitura, Família ou Igreja', id: '' },
    { name: 'União', id: '1' },
    { name: 'Prefeitura', id: '2' },
    { name: 'Família', id: '3' },
    { name: 'Igreja', id: '4' },
];

type ListType = {
    igreja: LaudemiosListItem[],
    familia: LaudemiosListItem[]
};

type InputsType = {
    obsLaudemios: string
};

const Laudemio = ({ processData, selects, setSelects, onSaveNewTopic }: Props) => {
    const router = useRouter();
    const [lists, setLists] = useState<ListType>();
    const [switchCheck, setSwitchCheck] = useState(false);
    const [dialogLaudemioVazio, setDialogLaudemioVazio] = useState(false);
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useForm<InputsType>({
        defaultValues: {
            obsLaudemios: selects?.obsLaudemios
        }
    })
    const laudemios = processData?.imovel.laudemios;

    useEffect(() => {
        getList()
    }, []);

    const getList = async () => {
        if (!!laudemios?.[0]) setSwitchCheck(true);
        const listLaudemios = await GetLaudemiosList() as unknown as LaudemiosListItem[];
        setLists({
            igreja: [
                { id: '', nome: 'Selecione...', tipo_laudemio_id: '4' },
                ...listLaudemios.filter(e => Number(e.tipo_laudemio_id) === 4)
            ],
            familia: [
                { id: '', nome: 'Selecione...', tipo_laudemio_id: '3' },
                ...listLaudemios.filter(e => Number(e.tipo_laudemio_id) === 3)
            ]
        })
    };

    const onCloseDialog = () => {
        setSwitchCheck(false);
        setDialogLaudemioVazio(false);
    };

    const openLaudemioVazio = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        if (checked && !!laudemios) {
            setDialogLaudemioVazio(true);
        }
    };

    const handleSalvarObs = () => {
        setSelects({ ...selects, obsLaudemios: watch('obsLaudemios') });
    };

    const handleDialogRevisao = () => {
        console.log('TESTE')
        
        onSaveNewTopic(); // Salva a análise

        setTimeout(() => {
            router.push(`/posvenda/${processData?.imovel.processo_id}/devolucao/`); // Redireciona para a tela de devolução
        }, 200);
    }

    console.log(laudemios);
    return (
        <>
            <div className='cards'>
                {!!laudemios?.[0]
                    ? <h2>O imóvel possui Laudêmio no contrato</h2>
                    : <h2>O imóvel não possui Laudêmio cadastrado</h2>
                }
                <SwitchWithLabel
                    check={switchCheck}
                    setCheck={setSwitchCheck}
                    label='Sim, o imóvel tem laudêmio.'
                    width='max-content'
                    handleChange={openLaudemioVazio}
                    disabled={!!laudemios?.[0]}
                />
                {!!laudemios?.[0] &&
                    <InputSelect
                        label={'De quantos laudêmios estamos falando?*'}
                        name={'quantLaudemios'}
                        option={optionsQuantLaudemios}
                        value={laudemios?.length}
                        disabled
                    />}

                {laudemios?.map(e => (
                    <div className='selects-line' key={e.id}>
                        <InputSelect
                            label={'Selecione o tipo de laudêmio*'}
                            name={'tipoLaudemio'}
                            option={tiposLaudemios}
                            value={e.tipo_laudemio}
                            disabled
                        />
                        {e.tipo_laudemio === '1' && <InputText
                            name=''
                            label='Insira o RIP referente ao laudêmio*'
                            placeholder='9999.99999.999-9'
                            value={e.valor_laudemio}
                            disabled
                        />}
                        {e.tipo_laudemio === '3' &&
                            <InputSelect
                                label={'Selecione a família referente ao laudêmio*'}
                                name={'familiaLaudemio'}
                                option={lists?.familia || []}
                                value={e.valor_laudemio}
                                disabled />
                        }
                        {e.tipo_laudemio === '4' &&
                            <InputSelect
                                label={'Selecione a igreja referente ao laudêmio*'}
                                name={'igrejaLaudemio'}
                                option={lists?.igreja || []}
                                value={e.valor_laudemio}
                                disabled
                            />
                        }
                    </div>
                ))}

            </div>

            <div className='cards'>
                <h2>Insira sua observação sobre os laudêmios:</h2>
                <EmptyTextarea
                    minRows={2}
                    value={watch('obsLaudemios')}
                    placeholder={'Digite aqui...'}
                    label={'Escreva livremente'}
                    {...register("obsLaudemios", {
                        onChange: (e) => setValue('obsLaudemios', e.target.value),
                        onBlur: () => handleSalvarObs()
                    })}

                />
            </div>

            <div className='cards'>
                <p>Itens importantes que merecem sua atenção:</p>
                <Chip className='chip primary' label="LAUDÊMIO" />
                <li className='bold'>Dar entrada - no laudêmio pelo site da familia;</li>
                <li className='bold'>Acompanhar - foro (se em aberto); </li>
                <li className='bold'>Emissão - Boleto do foro;</li>
                <li className='bold'>Emissão - Boleto do laudêmio; </li>
                <li className='bold'>Recolher o alvará. </li>
            </div>


            <SimpleDialog open={dialogLaudemioVazio} onClose={onCloseDialog}>
                <div className='dialog-image-content'>
                    <Image src={LaudemioImage} alt={'Laudemio não encontrado'} />
                    <div className='container-text-actions'>
                        <div className='text-container'>
                            <h2>Ops! Parece que o Gerente não incluiu laudêmios no processo :(</h2>
                            <span>Será necessário pedir Revisão da venda para o Gerente responsável.</span>
                            <span>Seu progresso na <span className='bold'>Análise</span> ficará salvo, não se preocupe.</span>
                            {/* <span>Você pode continuar sua análise normalmente, mas sugerimos que você peça uma <span className='bold'>Revisão de venda</span> para o Gerente responsável.</span> */}
                        </div>
                        <div className='btn-actions'>
                            <ButtonComponent size={'large'} variant={'text'} label={'Voltar'} onClick={onCloseDialog} />
                            <ButtonComponent
                                size={'large'}
                                variant={'contained'}
                                // label={'Salvar análise e pedir revisão'}
                                label="Pedir Revisão da Venda"
                                labelColor='white'
                                // onClick={() => router.push(`/posvenda/${processData?.imovel.processo_id}/devolucao/`)}
                                onClick={() => handleDialogRevisao()}
                            />
                        </div>
                    </div>
                </div>

            </SimpleDialog>
        </>
    )
}

export default Laudemio;