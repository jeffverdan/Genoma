import ButtonComponent from "@/components/ButtonComponent";
import CheckBox from "@/components/CheckBox";
import { ArrConflitosType } from "@/interfaces/IA_Recibo";
import { ExclamationTriangleIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import Check from "@mui/icons-material/Check";
import Paper from '@mui/material/Paper';
import { ReactElement } from "react";

interface PropsType {
    conflito: ArrConflitosType,
    onCheckIAMistake: (e: React.ChangeEvent<HTMLInputElement>) => void
    onClickEdit: () => void
    type: "imóvel" | "vendedores" | "compradores" | 'venda'
    checked_IA: boolean
    checked_edit: boolean
};

export default function PaperCard(props: PropsType) {
    const { conflito, onCheckIAMistake, onClickEdit, type, checked_IA, checked_edit } = props;

    const btnLabel = () => {
        if (conflito?.campo === 'quantidade') {
            return !!conflito?.checked_edit
                ? `Editar ${type.replace('es', '')}`
                : `Cadastrar novo ${type.replace('es', '')}`

        } else if(conflito?.checked_edit) {
            return 'Atualizado'
        }
        else return 'Atualizar'
    };

    return (

        <Paper className={`card-conflito${checked_IA ? ' check' : ''}${checked_edit ? ' sucess' : ''}`}>
            <div className='dados-container'>
                <div className='name-campo'>
                    {(!checked_IA && !checked_edit) && <ExclamationTriangleIcon className='red' />}
                    {!!checked_edit && <Check className="green" />}
                    <h4> {conflito?.campo_label} </h4>
                </div>

                {!checked_IA &&
                    <div className='validation-container'>
                        <div className='recibo-value'>
                            <p>No recibo de sinal:</p>
                            <p className='n400'>{conflito?.valor_recibo}</p>
                        </div>

                        <div className='cadastro-value'>
                            <p>No cadastro:</p>
                            <p className={checked_edit ? 'green' : 'red'}>{conflito?.checked_edit ?  conflito?.valor_edit : conflito?.valor_cadastro}</p>
                        </div>
                    </div>
                }
            </div>

            <div className='action-container'>
                <CheckBox
                    label={'Desconsiderar dados da IA'}
                    value={conflito?.campo}
                    onChange={(e) => onCheckIAMistake(e)}
                    checked={checked_IA}
                />
                {!checked_IA &&
                    <ButtonComponent
                        size={'medium'}
                        variant={'contained'}
                        disabled={conflito?.tipo_conflito === 'dados' && conflito?.checked_edit}
                        label={btnLabel()}
                        startIcon={(!conflito?.checked_edit && conflito?.campo === 'quantidade') ? <PlusIcon /> : <PencilIcon />}
                        onClick={() => onClickEdit()}
                        labelColor='white'

                    />
                }
            </div>
        </Paper>

    )

}