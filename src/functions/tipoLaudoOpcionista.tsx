import LojaByIDProcess from "@/apis/lojaByIdProcess";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

type Options = {
    value: string;
    disabled: boolean;
    label: string;
    checked: boolean;
    width?: string;
    percent?: number;
};

const useRadioLaudo = () => {
    const [radioLaudo, setRadioLaudo] = useState<Options[]>([
        { value: 'simples', disabled: false, label: 'Simples', checked: false, percent: 16 },
        { value: 'com_chave', disabled: false, label: 'Com chave', checked: false, percent: 18 },
        { value: 'exclusividade', disabled: false, label: 'Exclusividade', checked: false, percent: 20 },
        { value: 'lançamento', disabled: false, label: 'Lançamento', checked: false, percent: 8 },
    ]);
    const router = useRouter();

    async function consultLoja () {
        const id = router.query.idProcesso;
                
        if(id) {
            const loja = await LojaByIDProcess(Number(id));
            // console.log(loja);
    
            if(loja?.id === 5) { // 5 - TIJUCA
                radioLaudo[0].percent = 20 // SIMPLES
                radioLaudo[1].percent = 22 // CHAVE
                radioLaudo[2].percent = 24 // EXCLUSIVADADE
                setRadioLaudo([...radioLaudo]);
            }
        } else {
            console.error('ID não encontrado')
        }
    };

    useEffect(() => {
        consultLoja();
    },[])

    return [radioLaudo, setRadioLaudo] as const;
};

export { useRadioLaudo }