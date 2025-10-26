import React, {useState} from 'react';
import HeadSeo from '@/components/HeadSeo';
import Button from '@/components/ButtonComponent';
import EastIcon from '@mui/icons-material/East';
import Image from 'next/image';
import Slide1 from '@/images/slider/vendas/slide01.png';
import Slide2 from '@/images/slider/vendas/slide02.png';
import Slide3 from '@/images/slider/vendas/slide03.png';
import ButtonBack from '@/components/ButtonBack';
import { useRouter } from 'next/router';
import NavFooterMobile from '@/components/NavFooterMobile';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function Vendas() {
    const router = useRouter();
    const title: string = "Tela de slide";

    const [content, setContent] = useState('Cadastro de vendas em 3 etapas.');
    const [indexCarousel, setIndexCarousel] = useState(0);

    const handleClick = () => {
        router.push('/vendas/gerar-venda');
    };

    const onclickItem = (index: number, item: any) => {
        switch (index) {
            case 0:
                setContent('Cadastro de vendas em 3 etapas.');
                setIndexCarousel(0)
                break;

            case 1:
                setContent('Recibo de sinal gerado na hora.');
                setIndexCarousel(1);
                break;

            case 2:
                setContent('Todas as vendas em um só lugar.');
                setIndexCarousel(2);
                break;
        
            default:
                break;
        }
    };

    return (
        <>
            {/*SEO*/}
            <HeadSeo titlePage={title} description="Alguma coisa aqui" />

            <div className="container-intro">
                <div className="row">
                    <div className="coll">
                        <div className="back-butn-desk">
                            <ButtonBack />
                        </div>

                        <div className="content-slider">
                            <div className="item">
                                <h1 className="bold title-sec400">{content}</h1>

                                <Button
                                    style={{ marginTop: '50px' }}
                                    data-testid="btn-cadastrar"
                                    name="primary"
                                    size="large"
                                    label="Cadastrar venda"
                                    variant="contained"
                                    endIcon={<EastIcon className="icon icon-left" />}
                                    onClick={handleClick}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="coll">
                        <div 
                            className="area-carousel" 
                            style={
                                    {
                                        background: indexCarousel === 0 
                                            ? '#EDF8F7' 
                                            : indexCarousel === 1 
                                                ? '#FFF1E6' : '#FFF0CD'
                                    }
                                }
                        >
                            <Carousel
                                autoPlay={true}
                                interval={4000}
                                infiniteLoop={true}
                                onChange={onclickItem}
                                showStatus={false}
                                showArrows={false}
                                showThumbs={false}
                            >
                                <div>
                                    <Image src={Slide1} data-testid="gerar-venda-1" alt="Cadastro de vendas em 3 etapas." />
                                </div>
                                <div>
                                    <Image src={Slide2} data-testid="gerar-venda-2" alt="Recibo de sinal gerado na hora." />
                                </div>
                                <div>
                                    <Image src={Slide3} data-testid="gerar-venda-3" alt="Todas as vendas em um só lugar." />
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
            
            {/*Nav Mobile*/}
            <NavFooterMobile 
                label="Cadastrar venda"
                onClick={handleClick}
                icon="next"
            />
        </>
    )
}