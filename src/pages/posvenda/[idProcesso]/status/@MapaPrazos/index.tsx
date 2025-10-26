import React, { useEffect, useState } from 'react'
import ProcessType from '@/interfaces/PosVenda/LocalizarProcesso';
import { arrDeadLines } from '@/functions/returnDeadLines';
import { Chip, Tooltip } from '@mui/material';
import { HiExclamationCircle } from 'react-icons/hi2';
import ButtonComponent from '@/components/ButtonComponent';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface IAnaliseRecibo {
    processData?: ProcessType
    idProcesso: string
    setNewStatus: (value: boolean) => void
}

export default function MapaPrazos({ processData, idProcesso, setNewStatus }: IAnaliseRecibo) {
    const route = useRouter();
    const [hasDeadline, setHasDeadline] = useState(false);

    const actionRoute = (url?: string, params?: string) => {
        console.log('actionRoute', url, params);

        if (!url) return '';

        if (params) localStorage.setItem('params', params || '');

        if (url.includes('status')) {
            setNewStatus(true);
        } else route.push('/' + url);
    };

    useEffect(() => {
        arrDeadLines.forEach((deadline) => {
            if (!!processData?.deadline?.[deadline.key][0]) {
                setHasDeadline(true);
            }
        });
    }, [processData]);

    return (
        <>
            {hasDeadline &&
                <section className='cards topicos MapaPrazos'>
                    <div className='title'>
                        <h2>Prazos</h2>
                        {arrDeadLines.map((deadline, index) =>
                            !!processData?.deadline?.[deadline.key][0] ?
                                <Tooltip key={deadline.key + index} title={`${processData?.deadline?.[deadline.key].length > 1 ? deadline.labelPlural : deadline.labelSingular}`}>

                                    <Chip
                                        className={`chip ${deadline.color}`}
                                        label={`${processData?.deadline?.[deadline.key].length}`}
                                    />
                                </Tooltip>
                                : <></>
                        )}
                    </div>
                    <div className='list-items'>
                        {arrDeadLines.map((urgencia) => (
                            processData?.deadline?.[urgencia.key].map((e, index) => (
                                <div className={`deadline-row ${urgencia.disabled}`} key={index}>
                                    <div className={`chip ${urgencia.color}`}>
                                        <div className="svg"><HiExclamationCircle size={20} /></div>
                                        {e.msg}
                                    </div>
                                    {!!e.action_route &&
                                        <ButtonComponent
                                            size={"medium"}
                                            variant={"contained"}
                                            onClick={() => actionRoute(e.action_route, e.action_params)}
                                            label={e.action_label || ''}
                                            labelColor="white"
                                        />
                                    }
                                    {!!e.action_link &&
                                        <Link
                                            href={e.action_link}
                                            target="blank"
                                            className="site"
                                        // onClick={(e) => stopBubbling(e)}
                                        >
                                            <ButtonComponent
                                                size={"medium"}
                                                variant={"contained"}
                                                label={e.action_label || ''}
                                                labelColor="white"
                                            />
                                        </Link>
                                    }
                                </div>
                            ))
                        ))}

                    </div>
                    <div className='btn-action'>

                    </div>
                </section>
            }
        </>
    )
}
