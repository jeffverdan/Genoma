import ButtonComponent from "@/components/ButtonComponent";
import { pessoaType } from "@/interfaces/OpenAI";
import { ArrowLeftOnRectangleIcon, CheckIcon } from "@heroicons/react/24/solid";
import { List, ListItemIcon, ListItemButton, ListItemText, Chip } from '@mui/material';
import { useEffect, useState } from "react";
import { HiArrowLeft, HiArrowRight, HiPencil } from "react-icons/hi2";
import SwipeableViews from 'react-swipeable-views-react-18-fix';

import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { ArrConflitosType, ArrMenuTypes, FormValues } from "@/interfaces/IA_Recibo/index";

import DadosPessoa from './@FormCadastro/DadosPessoa';
import Endereco from './@FormCadastro/Endereco';
import Averbacao from "./@FormCadastro/Averbacao";

import { checkAverbacao, checkDadosPessoa, checkEndereco, checkOrigem, checkProcurador } from "@/functions/PercentCadastro";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import getCpfDadosUsuario from "@/apis/getCpfDadosUsuario";
import Pessoa from "@/interfaces/Users/userData";
import Procurador from "./@FormCadastro/Procurador";
import Origem from "./@FormCadastro/Origem";
import Documentos from "./@FormCadastro/Documentos";
import SaveUser from "@/apis/postSaveUser";

interface PropsType {
    conflito: ArrConflitosType
    setConflito: (e: ArrConflitosType) => void
    setOpenCadastrar: (e: boolean) => void
    data: imovelDataInterface
}

type ResponseSaveUser = {
    usuario: Pessoa,
    status_perfil: string
}

export default function CadastrarPessoa(props: PropsType) {
    const { conflito, setConflito, setOpenCadastrar, data } = props;
    const [selectItem, setSelectItem] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<Pessoa>();
    // const [] = useState<Pessoa>(EmptyPessoa);
    // console.log(conflito);

    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            ddi: '55'
        }
    });

    useEffect(() => {

        const data = {
            ...conflito.pessoa,
            ddi: conflito.pessoa?.ddi || '55',
        } as Pessoa
        if (data) {
            setUserData(data);
            console.log(data);

            Object.keys(data).forEach((key) => {
                const typedKey = key as keyof Pessoa;
                const value = data[typedKey];
                setValue(key as any, value)
            });
        }
    }, [conflito])

    const [arrMenuItens, setArrMenuItens] = useState<ArrMenuTypes[]>([
        { id: 0, label: 'Dados pessoais', checked: false, Block: DadosPessoa, arrMissKeys: [], hiddenIn: '' },
        { id: 1, label: 'Endereço', checked: false, Block: Endereco, arrMissKeys: [], hiddenIn: ''  },
        { id: 2, label: 'Averbação', checked: false, Block: Averbacao, arrMissKeys: [], hiddenIn: 'compradores'  },
        { id: 3, label: 'Procurador', checked: false, Block: Procurador, arrMissKeys: [], hiddenIn: ''  },
        { id: 4, label: 'Origem', checked: false, Block: Origem, arrMissKeys: [], hiddenIn: 'vendedores'  },
        { id: 5, label: 'Documentos', checked: false, Block: Documentos, arrMissKeys: [], hiddenIn: ''  },
    ]);

    const saveData = async () => {
        let form = {};
        const idBloco = arrMenuItens[selectItem].id;

        Object.keys(watch()).forEach((key) => {
            const typedKey = key as keyof FormValues;
            const value = watch(typedKey);
            form = { ...form, [key]: value };
        })

        form = {
            ...form,
            bloco: idBloco,
            tipo_usuario: conflito.pessoa?.tipo_usuario?.replace('es', ''),
            socio: userData?.pj_socio === 1,
            representante: userData?.pj_representante === 1,
            processo_id: data.processo_id,
            averbacao: userData?.averbacao
        }

        if(idBloco === 3 && (!watch('procurador.nome') && !watch('procurador.telefone'))) return;

        const res = await SaveUser(form) as unknown as ResponseSaveUser;

        if (res?.usuario) {
            form = { ...form, ...res.usuario, uf: res.usuario.estado }
        }
        
        setUserData({ ...form as unknown as Pessoa });
        setConflito({
            ...conflito,
            pessoa: form as unknown as Pessoa,
            valor_recibo: conflito.valor_recibo?.toString().split(' - ')[0],
            valor_cadastro: watch('name'),
            valor_edit: watch('cpf_cnpj'),
            checked_edit: arrMenuItens.every((e) => !!e.checked)
        });
    };


    const onVoltar = async () => {
        await saveData();
        setTimeout(() => {
            setOpenCadastrar(false);
        }, 500)
    };

    const goToNextSlide = (arrIndex: number) => {
        const proxIndex = arrIndex + 1;
        const errorMsg = { type: 'required', message: 'Campo inválido' };
        const missItens = arrMenuItens[arrIndex].arrMissKeys;
        
        if(proxIndex >= arrMenuItens[arrMenuItens.length - 1].id) {
            return onVoltar();
        }
        
        if (missItens.length > 0) {
            console.log(arrMenuItens);
            
            missItens.forEach((key) => setError(key, errorMsg));
        } else {            
            saveData()
            arrMenuItens.length > proxIndex
                ? setSelectItem(proxIndex)
                : setOpenCadastrar(false)
        }
        // console.log(errors);

        // setSelectItem(arrIndex + 1);
    };

    const goToPrevSlide = (arrIndex: number) => {
        saveData()
        setSelectItem(arrIndex - 1);
    };

    useEffect(() => {
        if (userData) {            
            console.log('USER DATA', userData);

            //  PORCENTAGEM DE CADASTRO DADOS
            const percentDadosPessoais = checkDadosPessoa(userData);
            if (percentDadosPessoais.percent === 100) arrMenuItens[0].checked = true;
            else arrMenuItens[0].checked = false;
            arrMenuItens[0].arrMissKeys = percentDadosPessoais.miss;

            //  PORCENTAGEM DE CADASTRO ENDEREÇO
            const percentEndereco = checkEndereco(userData);
            if (percentEndereco.percent === 100) arrMenuItens[1].checked = true;
            else arrMenuItens[1].checked = false;
            arrMenuItens[1].arrMissKeys = percentEndereco.miss;

            //  PORCENTAGEM DE CADASTRO AVERBACAO
            if (!!userData.averbacao?.[0]) {
                const percentAverbacao = checkAverbacao(userData);
                if (percentAverbacao.percent === 100) arrMenuItens[2].checked = true;
                else arrMenuItens[2].checked = false;
                arrMenuItens[3].arrMissKeys = percentAverbacao.miss as unknown as (keyof FormValues)[];
            } else arrMenuItens[2].checked = true;

            //  PORCENTAGEM DE CADASTRO PROCURADOR
            if (!!userData.procurador?.id) {
                const percentProcurador = checkProcurador(userData);
                if (percentProcurador.percent === 100) arrMenuItens[3].checked = true;
                else arrMenuItens[3].checked = false;
                arrMenuItens[3].arrMissKeys = percentProcurador.miss as unknown as (keyof FormValues)[];
            } else arrMenuItens[3].checked = true;

            //  PORCENTAGEM DE CADASTRO ORIGEM
            if (userData.tipo === 'compradores') {
                const percentOrigem = checkOrigem(userData);
                if (percentOrigem.percent === 100) arrMenuItens[4].checked = true;
                else arrMenuItens[4].checked = false;
                arrMenuItens[4].arrMissKeys = percentOrigem.miss as unknown as (keyof FormValues)[];
            } else {
                arrMenuItens[4].checked = true;
            }

            //  PORCENTAGEM DE CADASTRO DOCUMENTOS
            if (userData.documentos?.data?.some((e) => !!e.tipo_documento_ids.find((doc) =>
                doc.tipo_documento_id === 20 || doc.tipo_documento_id === 43 || doc.tipo_documento_id === 44))) {
                arrMenuItens[5].checked = true;
            }

            Object.keys(userData).forEach((key) => {
                const typedKey = key as keyof Pessoa;
                const value = userData[typedKey];
                if (key === 'procurador') {
                    if (userData.procurador?.nome) clearErrors(`procurador.nome`);
                    if (userData.procurador?.telefone) clearErrors(`procurador.telefone`);
                }
                else if (value) clearErrors(key as any)
            });

            setArrMenuItens([...arrMenuItens])
        }
    }, [userData]);

    const onSelectItem = (index: number) => {
        if (userData?.id) setSelectItem(index);
        else {
            // setSelectItem(index);
        }
    };

    return (
        <div className="cadastro-pessoa">
            <div className="side-bar">
                <div>
                    <div className="chips-container">
                        <Chip className="chip" label={`etapas ${arrMenuItens.filter(e => e.checked).length}/${arrMenuItens.length}`} />
                        <Chip className="chip" label={'pessoa física'} />
                    </div>
                    <List>
                        {arrMenuItens.filter((e) => e.hiddenIn !== conflito?.pessoa?.tipo).map((item, index) => (
                            <ListItemButton
                                selected={selectItem === index}
                                key={index}
                                onClick={() => onSelectItem(index)}
                                className={item.checked ? 'checked' : ''}
                            >
                                <ListItemIcon >
                                    {(selectItem === index || !item.checked) ? <HiPencil /> : <CheckIcon />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}

                                />
                            </ListItemButton>
                        ))}
                    </List>
                </div>
                <ButtonComponent
                    label="Voltar"
                    name="secondary"
                    size='medium'
                    variant='text'
                    onClick={() => onVoltar()}
                    startIcon={<ArrowLeftOnRectangleIcon className="icon start-icon" />}
                />


            </div>

            {userData &&
                <div className='form-cards'>
                    <SwipeableViews
                        axis={'y'}
                        index={selectItem}
                        className='swipe-container'
                    >
                        {arrMenuItens.filter((e) => e.hiddenIn !== conflito?.pessoa?.tipo).map((item, index) => (
                            <div className="card-container" key={index}>
                                <div className="card-form">
                                    <item.Block
                                        index={index}
                                        data={data}
                                        userData={userData}
                                        setUserData={setUserData}
                                        type={userData.tipo || 'vendedores'}
                                        register={register}
                                        errors={errors}
                                        watch={watch}
                                        setValue={setValue}
                                        clearErrors={clearErrors}
                                    />
                                    <div className="action-card">
                                        <div>
                                            {index > 0 &&
                                                <ButtonComponent
                                                    size={"large"}
                                                    variant={"text"}
                                                    name={"previous"}
                                                    label={"Anterior"}
                                                    startIcon={<HiArrowLeft className='primary500' />}
                                                    onClick={() => goToPrevSlide(index)}
                                                />}
                                        </div>
                                        <div>
                                            <ButtonComponent
                                                size={"large"}
                                                variant={"contained"}
                                                name={"previous"}
                                                labelColor='white'
                                                label={index === 5 ? "Concluír cadastro" : "Próximo"}
                                                endIcon={<HiArrowRight fill='white' />}
                                                onClick={() => goToNextSlide(index)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="empty"></div>
                            </div>
                        ))}

                    </SwipeableViews>
                </div>
            }


        </div>
    )

}