import React, {useState, useEffect} from 'react'
import Button from '../ButtonComponent';
import { useRouter } from 'next/router';
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

export default function ButtonSalvarSair(props: any) {
    const {url} = props;
    const router = useRouter();
    const pageUrl = router.asPath;

    const [labelBtn, setLabelBtn] = useState('Salvar e Sair');

    useEffect(() => {
        const labelButton = () => {
            const splitPageUrl: any[] = pageUrl.split('/');   
            if(splitPageUrl[4] === 'checkout') setLabelBtn('Sair');
        }
        labelButton()
    }, [pageUrl])
    
    return (
        <div className="btn-salvar-sair">
            <Button
                label={labelBtn}
                name="secondary"
                size="medium"
                variant="outlined"
                id='btn-salvar-sair'
                startIcon={<ArrowLeftOnRectangleIcon className="icon icon-left" />}
                onClick={() => router.push(url)}
            />
        </div>
    )
}
