import React, { useState, useEffect, useContext } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import { useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import TextArea from "@/components/TextArea";
import InputText from "@/components/InputText/Index";
import SwitchButtom from "@/components/SwitchButton";
//import ImovelContext from '@/context/ImovelContext';
import UsersContext from '@/context/Vendas/ContextBlocks';
import { useRouter } from 'next/router';
import InputPhone from '@/components/InputPhone';
import FocusTrap from '@mui/material/Unstable_TrapFocus';
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import MultipleSelectCheckmarks from '@/components/SelectMultiInput';
import ImovelData from '@/interfaces/Imovel/imovelData';

interface FormValues {
    // nomeProcurador: string;
    // ddiProcurador: string,
    // telefoneProcurador: string;
    // validarAverbacao: boolean;

    validarAverbacao: any[]
}

type BlockProps = {
    handleNextBlock: (index: number) => void;
    handlePrevBlock: (index: number) => void;
    index: number;
    data: ImovelData;
    Footer: React.FC<{
        goToPrevSlide: (index: number) => void;
        goToNextSlide: any;
        index: number;
    }>
};

type AverbacaoType = {    
    averbacao: ArrAverbacaoType[]
}

type ArrAverbacaoType =  {
    id: number | string
    id_edit: number | string
}

type ArrTipos = {
    "topico_id": 1,
    "id": number | string
    "name": string
}

const listAverbacao = [
    // { id: '0', name: "Selecione..." },
    // { topico_id: 1, id: 1, name: 'Construção' },
    { topico_id: 1, id: 2, name: 'Casamento' },
    // { topico_id: 1, id: 3, name: 'Logradouro' },
    // { topico_id: 1, id: 4, name: 'Cadastro municipal' },
    { topico_id: 1, id: 5, name: 'Cancelamento de usufruto' },
    { topico_id: 1, id: 6, name: 'Separação ou divórcio' },
    { topico_id: 1, id: 7, name: 'União estável' },
    { topico_id: 1, id: 8, name: 'Maior idade' },
    { topico_id: 1, id: 9, name: 'Baixa de Alienação Fiduciária' }
];

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer }) => {
    const {
        dataSave, setDataSave,
        idProcesso, selectItem,
        dataUsuario,
        concluirForm, setConcluirForm,
    } = useContext(UsersContext);
    console.log('dataUsuario: ' , dataUsuario)

    const usuario = {...dataUsuario, averbacao: dataUsuario?.averbacao || []};
    const errorMsg = 'Campo obrigatório';
    const router = useRouter()
    const dataUrl: any = router.query;
    const [check, setCheck] = useState(usuario?.averbacao.length !== 0 ? true : false);
    const [open, setOpen] = useState(false);
    const [selects, setSelects] = useState<AverbacaoType>({ averbacao: usuario?.averbacao || [] });

    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        trigger,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({});

    console.log('WATCH: ' , watch());
    console.log('ERRORS: ' , errors);

    const handleClick = (direction: string) => {
        if (direction === 'NEXT') {
            handleNextBlock(index);
        } else {
            handlePrevBlock(index);
        }
    };

    const returnSelects = () => {
        if (usuario?.averbacao?.length > 0) {
            setCheck(true);
            setSelects({ averbacao: usuario?.averbacao });
        } else {
            setCheck(false);
            setSelects({ averbacao: [{ id: '0', id_edit: '' }] });
        }
    }

    const returnCheck = () => {
        if (!check) {
            console.log('CHECK FALSE')
            clearErrors('validarAverbacao')
            setSelects({ averbacao: [] });
            saveData();
        }
    }

    useEffect(() => {
        returnSelects();
    }, []);

    useEffect(() => {
        returnCheck();
    }, [check])

    // const onCheckSelect = (e: ArrTipos[]) => {
    //     const newList: ArrAverbacaoType[] = [];
    //     e.forEach((value) => {
    //         newList.push({ id: value.id, id_edit: selects.averbacao.find(item => item.id === value.id)?.id_edit || '' })
    //     });        
    //     setSelects({ averbacao: [ ...newList ] });
    //     // setUserData({ ...userData, averbacao: newList });
    // };

    const onCheckSelect = (e: ArrTipos[]) => {
        const newList: ArrAverbacaoType[] = e.map((value) => ({
            id: value.id,
            id_edit: selects.averbacao.find((item) => item.id === value.id)?.id_edit || ''
        }));

        if(newList.length !== 0) {
            console.log('AQUI 2')
            clearErrors('validarAverbacao');
        }
    
        setSelects({ averbacao: [...newList] });
    };

    const handleSubmitForm = () => {
        if (selects.averbacao.length === 0 && check) {
            setError('validarAverbacao', { message: errorMsg });
        } else {
            clearErrors('validarAverbacao');
            handleClick("NEXT");
        }
    };

    const saveData = () => {
        const form = {
            ...usuario,
            bloco: index,
            tipo_usuario: dataUrl.users,
            usuario_id: dataUsuario?.id || localStorage.getItem('usuario_cadastro_id') || '',
            processo_id: data.processo_id,
            averbacao: !check ? [] : selects.averbacao,
            pj_representante_id: dataUrl.user === 'pessoa-juridica' ? dataUrl?.index[0] : '',
            tipo_pessoa: 0,
        }
        setDataSave(form);
    };

    // console.log('USUÁRIO: ' , usuario);
    // console.log('CHECK: ', check);
    // console.log('SELECTS: ' , selects)

    return (
        <FocusTrap disableEnforceFocus open>
            <>
                <div className={styles.containerBlock}>
                    <div className={styles.headerBlock}>
                        <h3>Será necessário averbar algum documento deste {dataUrl.users}?</h3>
                    </div>

                    <div className="mt36 mb51" style={{ width: '400px' }}>
                        <SwitchButtom width="max-content" check={check} setCheck={setCheck} label='Sim, será necessário averbar.' />
                    </div>


                    {!!check &&
                        <>
                            <MultipleSelectCheckmarks
                                label={`Tipos de averbações*`}
                                name={''}
                                options={listAverbacao}
                                value={selects.averbacao || []}
                                // error={error?.[checkType]?.reviews?.[index]?.errorCheck}
                                error={!!errors?.validarAverbacao}
                                onChange={(e: any[]) => onCheckSelect(e)}
                                labelMenu={`Tipos de averbações`}
                                onBlurFunction={saveData}
                                // maxWidth={300}
                                placeholder='Selecione...'
                                className="select-averbacao"
                            />

                            <>
                                <input 
                                    type="hidden" 
                                    {...register('validarAverbacao', {
                                        validate: () =>
                                        selects.averbacao && selects.averbacao.length > 0 || "Selecione pelo menos um tipo de averbação.",
                                    })} 
                                />

                                    {errors?.validarAverbacao && (
                                    <p className="errorMsg" style={{position: 'relative', top: '-25px'}}>*{errors.validarAverbacao.message}</p>
                                )}
                            </>
                        </>
                    }

                    {Footer &&
                        <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(handleSubmitForm)} index={index} />}
                </div>
            </>
        </FocusTrap>
    );
};

export default BlockPage;