
import { CheckIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { CircularProgress, Collapse, Divider, List, ListItemButton } from '@mui/material';
import { useState } from 'react';
import { ItemType } from './interface';

interface PropsType {
    open: boolean;
    items: ItemType[];
}

export default function FeedbackCertidoes(props: PropsType) {
    const { open, items } = props;
    const [collapseMenu, setCollapseMenu] = useState(true);


    return (
        <>
            {open && <Collapse orientation="horizontal" in={collapseMenu} collapsedSize={66} className='loading-container' >
                {collapseMenu ? <ChevronDoubleLeftIcon className='loading-icon' onClick={() => setCollapseMenu(!collapseMenu)} /> : <ChevronDoubleRightIcon className='loading-icon' onClick={() => setCollapseMenu(!collapseMenu)} />}
                <Divider />
                {items.map((item) => (<>
                    <div className='label-container'>
                        {item.loading ? <CircularProgress size={20} /> : item.error ? <XMarkIcon className='error icon' /> : <CheckIcon className='success icon' />}
                        <span>{item.label}</span>
                    </div>
                    <Divider />
                </>))}
            </Collapse>}
        </>
    );
}