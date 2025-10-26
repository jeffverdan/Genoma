import { BlockProps, FormValues } from "@/interfaces/IA_Recibo/index";
import { useEffect, useState } from "react";
import SwitchButtom from "@/components/SwitchButton";
import InputSelect from "@/components/InputSelect/Index";
import MultipleSelectCheckmarks from "@/components/SelectMultiInput";
import { SelectsType } from "@/interfaces/PosVenda/Analise";

const listAverbacao = [
    // { id: '0', name: "Selecione..." },
    { topico_id: 1, id: 1, name: 'Construção' },
    { topico_id: 1, id: 2, name: 'Casamento' },
    { topico_id: 1, id: 3, name: 'Logradouro' },
    { topico_id: 1, id: 4, name: 'Cadastro municipal' },
    { topico_id: 1, id: 5, name: 'Cancelamento de usufruto' },
    { topico_id: 1, id: 6, name: 'Separação ou divórcio' },
    { topico_id: 1, id: 7, name: 'União estável' },
    { topico_id: 1, id: 8, name: 'Maior idade' },
    { topico_id: 1, id: 9, name: 'Baixa de Alienação Fiduciária' }
];

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

export default function Averbacao({ index, data, type, userData, setUserData, register, errors, watch, setValue, clearErrors }: BlockProps) {
    const inicialSelect = {        
        averbacao: []
    }
    const errorMsg = 'Campo inválido';
    const [check, setCheck] = useState(false);
    const [averbacao, setAverbacao] = useState<number | string>();
    const [selects, setSelects] = useState<AverbacaoType>(inicialSelect);

    const onBlur = (e?: React.ChangeEvent<HTMLInputElement>) => {
        if (e) {
            const name = e.target.name as keyof FormValues;
            const value = e.target.value;
            userData = { ...userData, [name]: value }
        }
        setUserData({ ...userData });
    };

    useEffect(() => {
        if (!check) {
            setSelects(inicialSelect);
            userData.averbacao = [];
            setUserData({...userData});
        }
    }, [check]);

    useEffect(() => {
        if(userData.averbacao?.[0]) {
            setCheck(true);
            setSelects({averbacao: userData.averbacao})
        }
    },[userData])

    console.log(userData);


    const onCheckSelect = (e: ArrTipos[]) => {
        const newList: ArrAverbacaoType[] = [];
        e.forEach((value) => {
            newList.push({ id: value.id, id_edit: selects.averbacao.find(item => item.id === value.id)?.id_edit || '' })
        });        
        setSelects({ averbacao: [ ...newList ] });        
        setUserData({ ...userData, averbacao: newList });
    };

    return (
        <div className="form-container">
            <div className="title">
                <h3>Será necessário averbar algum documento deste {type?.replace('es', '')}?</h3>
            </div>


            <SwitchButtom width="max-content" check={check} setCheck={setCheck} label='Sim, será necessário averbar.' />
            {!!check &&
                <MultipleSelectCheckmarks
                    label={`Tipos de averbações*`}
                    name={''}
                    options={listAverbacao}
                    value={selects.averbacao || []}
                    // error={error?.[checkType]?.reviews?.[index]?.errorCheck}
                    onChange={(e: any[]) => onCheckSelect(e)}
                    labelMenu={`Tipos de averbações`}
                    // maxWidth={300}
                    placeholder='Selecione...'
                    className="select-averbacao"
                />
            }



        </div>
    )
}