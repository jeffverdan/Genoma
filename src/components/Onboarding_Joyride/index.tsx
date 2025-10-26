import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, ACTIONS, ORIGIN, EVENTS, Step, TooltipRenderProps, Events } from 'react-joyride';
import ButtonComponent from '../ButtonComponent';
import { ArrowBack, ArrowForward, Check } from '@mui/icons-material';
import { colors } from '@/styles/paletas';

type EventsType = "step:after" | "error:target_not_found";
type StatusType = "skipped" | "finished"

interface PropsType {
    steps: Step[]
    indexProps?: number
    setIndexProps?: (index: number) => void
    indexActionsBtn?: number[] // PASSAR AQUI O INDEX DAS STEPS QUE NÃO VÃO TER O BOTÃO DE AVANÇAR
    disableScrolling?: boolean
}


export default function OnboardingJoyride({steps, indexProps, setIndexProps, indexActionsBtn, disableScrolling }: PropsType) {
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        if (indexProps) setStepIndex(indexProps || 0);        
    }, [indexProps]);

    useEffect(() => {
        console.log('stepIndex', stepIndex);
        if(setIndexProps) setIndexProps(stepIndex);
    },[stepIndex]);
    
    function CustomTooltip(props: TooltipRenderProps) {
        const { backProps, closeProps, continuous, index, primaryProps, skipProps, step, tooltipProps } =
            props;
    
        const stepIndex = index + 1;
        const ocultarNextBtn = indexActionsBtn?.includes(stepIndex);
    
        return (
            <div className="joyride-container" {...tooltipProps}>
                <div className='close-container'>
                    <span className='count'>{stepIndex}/{steps.length}</span>
    
                    <button className="x" {...closeProps}>
                        &times;
                    </button>
                </div>
    
                {step.title && <h4 className="joyride-title">{step.title}</h4>}
    
                <div className="joyride-content">{step.content}</div>
    
                <div className="joyride-footer-actions">
                    {/* <button className="skip" {...skipProps}>
                        Skip
                    </button> */}
                    <div className="back-next-container">
                        {index > 0 ? (
                            <button className="joy-button" {...backProps}>
                                <ButtonComponent size='small' variant='text' label={'Retornar'} startIcon={<ArrowBack />} />
                            </button>
                        ) : <div></div>
                        }
                        {(continuous && !ocultarNextBtn) && (
                            <button className="joy-button" {...primaryProps}>
                                <ButtonComponent
                                    size='small'
                                    variant='contained'
                                    name='next'
                                    label={stepIndex === steps.length ? 'Finalizar' : 'Avançar'}
                                    endIcon={stepIndex === steps.length ? <Check /> : <ArrowForward />}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { action, index, origin, status, type } = data;
        console.log(index);
        
    
        if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
          // do something
        }
    
        if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type as EventsType)) {
          // Update state to advance the tour
          setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
            
        } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as StatusType)) {
          // You need to set our running state to false, so we can restart if we click start again.
          setRun(false);
        }
    
        console.groupCollapsed(type);
        console.log(data); //eslint-disable-line no-console
        console.groupEnd();
      };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous={true}
            // run={run}
            stepIndex={stepIndex}
            // scrollToFirstStep={true}
            disableScrolling={disableScrolling}
            spotlightClicks={true}
            showSkipButton={false}
            steps={steps}
            styles={{
                options: {
                    arrowColor: '#fff',
                    backgroundColor: '#fff',
                    overlayColor: 'rgba(0, 0, 0, 0.4)',
                    primaryColor: '#'+colors.primary500,
                    textColor: '#000',
                    // width: 900,
                    zIndex: 10000,
                },
            }}
            tooltipComponent={CustomTooltip}
        />
    );
}