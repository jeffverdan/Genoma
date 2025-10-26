
import ButtonComponent from '@/components/ButtonComponent';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { useEffect, useState } from 'react';

interface CornerFinanceiroProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    subtitle: string;
    actionPrimary?: () => void;
    labelPrimary?: string;
    contador?: number;
    secondaryAction?: () => void;
    labelSecondary?: string;
}

const CornerFinanceiro = ({ open, setOpen, title, subtitle, actionPrimary, labelPrimary, secondaryAction, labelSecondary, contador }: CornerFinanceiroProps) => {
    const [count, setCount] = useState(0);

    // Increment the count if contador is provided
    useEffect(() => {
        if(contador) {
            const interval = setInterval(() => {
                setCount(prevCount => {
                    if (prevCount < contador) {
                        return prevCount + 1;
                    } else {
                        clearInterval(interval);
                        return prevCount;
                    }
                });
            }, 1000); // Increment every second

            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, []);

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={open}
            className='corner-financeiro'
            onClose={() => setOpen(false)}
        >
            <div className='content-corner'>
                <p className='p1'>{title}</p>
                <p className='subtitle'>{subtitle}</p>
                <div className='footer-actions'>
                    {secondaryAction &&
                        <ButtonComponent
                            variant='text'
                            size='small'
                            label={labelSecondary || ''}
                            name='secondary-snackbar'
                            labelColor='primary'
                            onClick={secondaryAction}
                        />
                    }

                    {actionPrimary &&
                        <ButtonComponent
                            variant='contained'
                            size='small'
                            disabled={contador ? count >= contador : false}
                            label={(labelPrimary || '') + (contador ? ` (${count})` : '')}
                            name='primary-snackbar'
                            labelColor='white'
                            onClick={actionPrimary}
                        />
                    }
                </div>
            </div>
        </Snackbar>
    );
}

export default CornerFinanceiro;