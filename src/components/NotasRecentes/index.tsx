import React, {useState} from 'react'
import styles from './index.module.scss'
import Chip from '@mui/material/Chip'
import {Avatar} from '@mui/material';
import ButtonComponent from '../ButtonComponent';
import { CheckCircleIcon, ListBulletIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ModalFormNotas from './ModalFormNotas';
import Skeleton from '@mui/material/Skeleton';
import postExcluirNota from '@/apis/postExcluirNota';
import SkeletonNotas from './SkeletonNotas';

// interface IValoresNota {
//     data_criacao: string
//     descricao: string
//     id: number
//     importante: number
//     responsavel: {
//         id: number,
//         nome: string,
//     }
//     titulo: string
// }
// interface INotasRecentes {
//     data: IValoresNota[]
//     msg: string
//     status: boolean
// }

interface INotas {
    loadingNotasRecentes: boolean,
    idProcesso: string
    returnNotas: () => void
    notasRecentes: any
}

export default function NotasRecentes({loadingNotasRecentes, idProcesso, returnNotas, notasRecentes} : INotas) {
    const nota = {
        titulo: 'Teste',
        nota: 'Olá tudo bem?',
        importancia: true
    }
    const [selectNota, setSelectNota] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [loadingModalNota, setLoadingModalNota] = useState(true);

    const handleClickOpen = () => {
        setOpenModal(true);
    };
   
    const handleOpenEdit = async (e: any, index: number) => {
        setLoadingModalNota(true);
        const nota = notasRecentes?.data[index];
        // console.log('Selecionada: ' , nota);
        await setSelectNota(nota);
        setOpenModal(true);
        setLoadingModalNota(false);
    }

    const handleDelete = async (e: any, id: number) => {
        // console.log('Deletou')

        const res = await postExcluirNota(id);
        returnNotas();
    }

    function reduzirNome(nome: any){
        // console.log(nome)
        const splitNome = nome.split(' ');
        const primeiroNome = splitNome[0];
        return primeiroNome;
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.card}>
                        <div className={styles.header}>
                            Notas recentes
                        </div>

                        <div className={styles.listItems}>

                            {
                                loadingNotasRecentes
                                ?
                                <>
                                    <SkeletonNotas />
                                </>
                                :
                                <>
                                    {
                                        notasRecentes?.data?.map((nota: any, index: number) => 
                                            <>
                                            <div className={styles.item}>
                                                <div className={`${styles.row} ${styles.row1}`}>
                                                    <div className={styles.persona}>
                                                        <Avatar sx={{ width: 30, height: 30, bgcolor: '' }} alt="Angela Maria" />
                                                        <span>{reduzirNome(nota?.responsavel?.nome)}</span>
                                                    </div>

                                                    <div className={styles.col}>
                                                        <div className={styles.title}>{nota?.titulo}</div>
                                                        <div className={styles.description}>{nota?.descricao}</div>
                                                    </div>
                                                </div>
                                                <div className={`${styles.row} ${styles.row2}`}>
                                                    <div className={styles.info}>
                                                        {
                                                            nota?.importante === 1 && <Chip label='Importante' className="chip yellow" />
                                                        }
                                                        <div className={styles.data}>{nota?.data_criacao}</div>
                                                    </div>

                                                    <div className={styles.action}>
                                                        <div className={styles.btnAction}>
                                                            <ButtonComponent
                                                                startIcon={<PencilIcon width={18} height={18} />}
                                                                label='Editar'
                                                                variant='text'
                                                                labelColor='#464F53'
                                                                size='small'
                                                                onClick={e => handleOpenEdit(e, index)}
                                                            />
                                                        </div>
                                                        
                                                        <div className={styles.btnAction}>
                                                            <ButtonComponent
                                                                startIcon={<XMarkIcon width={18} height={18} />}
                                                                label='Excluir'
                                                                variant='text'
                                                                labelColor='#464F53'
                                                                size='small'
                                                                onClick={e => handleDelete(e, nota?.id)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </>
                                        )
                                    }
                                </>
                            }
                        </div>

                        <div className={styles.footer}>
                            <ButtonComponent 
                                variant='text'
                                labelColor='#464F53'
                                size='small'
                                label="Adicionar nota"
                                startIcon={<PlusIcon width={18} height={18} />}
                                onClick={e => [setOpenModal(true), setLoadingModalNota(false), setSelectNota([])]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {
                openModal && 
                <ModalFormNotas
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    idProcesso={idProcesso}
                    loadingModalNota={loadingModalNota} 
                    returnNotas={returnNotas}
                    selectNota={selectNota}
                />
            }
        </>
    )
}
