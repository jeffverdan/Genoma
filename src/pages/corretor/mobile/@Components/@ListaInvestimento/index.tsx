import { ItemListRecentsType } from "@/interfaces/Corretores"
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Chip, Avatar } from '@mui/material/';
import Image from "next/image";
import { useEffect, useState, memo, useCallback } from "react";
import FlameIcon from "@/images/FlameIcon";
import HotSteamIcon from "@/images/HotSteamIcon";
import SnowflakeIcon from "@/images/SnowflakeIcon";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { useRouter } from "next/router";

interface PropsType {
    list: ItemListRecentsType[]
    setSelectProcess: (e: ItemListRecentsType | null) => void
    typeList?: string
}

// eslint-disable-next-line react/display-name
const Row = memo(({ data, index, style }: ListChildComponentProps) => {
    const { items, setSelectProcess, iconTemperatura, typeList } = data;
    const item = items?.[index];
    const router = useRouter();


    const urlRedirect = useCallback((parcelaId: string) => {
        const corretorId = localStorage.getItem('usuario_id') || '';
        return router.push(`/corretor/${corretorId}/investimento/${parcelaId}`);
    }, [router]);

    return (
        <div key={index} className="item-container" /*onClick={() => setSelectProcess(item)}*/ onClick={() => urlRedirect(String(item?.imovel_id))} style={style}>
            <div className="valor-date">
                <div className="valor-container">
                    <div className="header-termometro">
                        <div className="legenda-termometro">
                            {iconTemperatura}
                            <Chip className={`chip ${typeList}`} label={typeList} />
                        </div>
                    </div>
                    <div className={`valor-content valor-termometro`}>
                        <span className="moeda">R$</span>
                        <span className="valor">{item?.valor_anunciado || '-----'}</span>
                    </div>
                </div>
                <div className="date-container">
                    <div className="data-atualizacao">
                        <span>Última atualização</span>
                        <p className="data">{item?.data_atualizacao}</p>
                    </div>
                </div>
            </div>

            <div className="info-container">
                <Avatar >
                    {item?.url_imagens
                        ? <Image className="img-anuncio" src={item.url_imagens} width={40} height={40} alt="Foto imóvel" />
                        : item?.link_imagem_miniatura
                            ? <Image className="img-anuncio" src={item?.link_imagem_miniatura || ''} width={40} height={40} alt="Foto imóvel" />
                            : <PhotoIcon width={20} />
                    }
                </Avatar>
                <div className="endereco-container">
                    <p>{item?.logradouro}{item?.numero ? ', ' + item?.numero : ''}</p>
                    <p className="subtitle">
                        {item?.unidade || ''}
                        {item?.complemento || ''}
                        {((item?.unidade || item?.complemento) && item?.bairro) ? ' - ' : ''}
                        {item?.bairro || ''}
                    </p>
                </div>
            </div>
        </div>
    );
});

export default function ListComission(props: PropsType) {
    const { list, setSelectProcess, typeList } = props;
    const [listAtt, setListAtt] = useState<ItemListRecentsType[]>(list);

    useEffect(() => {
        setListAtt(list);
    }, [list]);

    const iconTemperatura = typeList === 'frio'
        ? <SnowflakeIcon fill={'#ACA9FF'} height={20} />
        : typeList === 'morno'
            ? <HotSteamIcon fill={'#74848B'} height={20} />
            : <FlameIcon fill={'#FF7878'} height={20} />;

    return (
        <div className="list-corretores">
            {!!listAtt && <List
                height={600} // altura total da lista na tela
                itemCount={listAtt.length}
                itemSize={160} // altura de cada item da lista (ajuste conforme seu CSS)
                width={"100%"}
                itemData={{ items: listAtt, setSelectProcess, iconTemperatura, typeList }}
            >
                {Row}
            </List>}
        </div>
    );
}
