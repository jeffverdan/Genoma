import { useEffect, useState } from "react";
import Primeira from '@/images/onboarding-inicial-corretor/primeira.png'
import Segunda from '@/images/onboarding-inicial-corretor/segunda.png'
import Terceira from '@/images/onboarding-inicial-corretor/terceira.png'
import X_Icon from '@/images/X-ico.svg'
import SwipeableViews from "react-swipeable-views-react-18-fix";
import Image from "next/image";
import ButtonComponent from "@/components/ButtonComponent";
import { ArrowLeft } from "@mui/icons-material";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

type PropsType = {
    inicialAcess: boolean,
    setInicialAcess: (value: boolean) => void
}

export default function InicialOnboarding({inicialAcess, setInicialAcess}: PropsType) {
    const [activeStep, setActiveStep] = useState(-1);
    const steps = [
        { id: 0, title: 'Acompanhe o status das comissões', img: Primeira, className: 'primeira' },
        { id: 1, title: 'Fique por dentro do seu saldo', img: Segunda, className: 'segunda' },
        { id: 2, title: 'Faça download dos MEIs', img: Terceira, className: 'terceira' },
    ];

    useEffect(() => {
        setActiveStep(0);
    }, []);

    useEffect(() => {
        if (activeStep === 3) {
            setInicialAcess(false);
            localStorage.setItem('firstAcess', 'false');
        }
    }, [activeStep]);

    const handleTab = (index: number) => {
        setActiveStep(index);
    };

    return (
        <div className="onboarding corretor">
            <div className="close-container">
                <Image src={X_Icon} alt="X" className="x-icon" onClick={() => setActiveStep(3)} />
            </div>

            <SwipeableViews
                axis={'x'}
                index={activeStep}
                onChangeIndex={handleTab}
                className='swipe-container'
            >
                {steps.map((tab, index) => (
                    <div key={index} hidden={index != activeStep} className="onboarding-container">
                        <div className={"image-container " + tab.className}>
                            <Image src={tab.img} alt={tab.title} />
                        </div>
                        <h3>{tab.title}</h3>
                    </div>
                ))}
            </SwipeableViews>

            <div className="dots-container">
                {steps.map((_, i) => (
                    <div key={i} className={i == activeStep ? 'dot active' : 'dot'} onClick={() => handleTab(i)}></div>
                ))}
            </div>
            <div className="action-buttons">
                <ButtonComponent 
                    label={activeStep === 2 ? "Começar!" : "Próximo"} 
                    endIcon={activeStep === 2 ? "" : <ArrowRightIcon width={20} fill="white" />} 
                    onClick={() => setActiveStep(activeStep + 1)} 
                    size={"large"} 
                    variant={"contained"} 
                    labelColor="white" 
                />
                <ButtonComponent label="Pular" onClick={() => setActiveStep(3)} size={"large"} variant={"text"} />
            </div>
        </div>
    );
}