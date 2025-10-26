import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { Paper, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import ButtonComponent from '@/components/ButtonComponent';
// import SwipeableViews from 'react-swipeable-views';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import Resumo from './Resumo';
import Recibo from './Recibo';
import Comissao from './Comissao';
import Loading from './Loading'

interface Props {
    imovelData: imovelDataInterface,
    returnData?: any

}

interface TabsType {
    tabs: ["Resumo", "Recibo", "Comissão"]
    selectTab: number
}

const Venda = ({ imovelData, returnData }: Props) => {
    const [options, setOptions] = useState<TabsType>({
        tabs: ["Resumo", "Recibo", "Comissão"],
        selectTab: -1
    });
    const verificarImovelData = Object.keys(imovelData).length;

    useEffect(() => {
        const aba = Number(localStorage.getItem('detalhes-submenu')) || 0;
        console.log(aba);

        setOptions({ ...options, selectTab: aba });
        if (aba)
            setTimeout(() => {
                localStorage.removeItem('detalhes-submenu');
            }, 1000);
    }, []);

    const handleTab = (value: any) => {
        setOptions({ ...options, selectTab: value });
    };

    return (
        <div className={`detalhes-container`}>
            <Paper className='paper options'>
                {options.tabs?.map((tab, index) => {
                    if (index < 5) {
                        return (
                            <div key={index}>
                                <ButtonComponent
                                    label={tab}
                                    id={index.toString()}
                                    name={options.selectTab === index ? 'name check' : 'name uncheck'}
                                    onClick={() => handleTab(index)}
                                    size={'medium'}
                                    variant={'text'}
                                />
                            </div>
                        )
                    }
                })}
            </Paper>

            <SwipeableViews
                axis={'x'}
                index={options.selectTab}
                onChangeIndex={handleTab}
                className='swipe-container'
            >
                {options?.tabs.map((tab, index) => (
                    <>
                        {
                            verificarImovelData === 0
                                ?
                                <Loading tab={tab} />
                                :
                                <div key={index} hidden={index != options.selectTab}>
                                    {options.selectTab === 0 && <Resumo imovelData={imovelData} />}
                                    {options.selectTab === 1 && <Recibo imovelData={imovelData} returnData={returnData} />}
                                    {options.selectTab === 2 && <Comissao imovelData={imovelData} />}
                                </div>
                        }
                    </>
                ))}
            </SwipeableViews>
        </div>
    )
}

export default Venda;
