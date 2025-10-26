import React, { useEffect, useState } from 'react'
import HeadSeo from '@/components/HeadSeo';
import ImageError from '../images/undraw_alert_re_j2op 1.svg';
import Image from 'next/image';
import ButtonComponent from '@/components/ButtonComponent';
import { HiArrowLeft } from 'react-icons/hi2';
import { useRouter } from 'next/router';

export default function Pagina403() {
    const router = useRouter();
    const [suspense, setSuspense] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('usuario_id') === null) {
            router.push('/');
        }
        else {
            setSuspense(false);
        }
    }, [])

    const handleRedirect = () => {
        window.history.go(-2);
    };

    return (
        suspense === false &&
        <>
            <HeadSeo titlePage={"Erro 403"} description='Erro 403' />
            <div className="container-error">
                <div className="content">
                    <Image src={ImageError} alt="undraw-error" title="403 (Sem permissão)" />
                    <div className="title">403 (Sem permissão)</div>
                    <p>Pedimos desculpas, mas você não pode acessar essa página</p>

                    <div className="btnReenvio">
                        <ButtonComponent
                            name={'reenviar'}
                            startIcon={<HiArrowLeft color={'#fff'} />}
                            label={'Voltar'}
                            size={'large'}
                            variant={'contained'}
                            labelColor={'white'}
                            onClick={handleRedirect}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
