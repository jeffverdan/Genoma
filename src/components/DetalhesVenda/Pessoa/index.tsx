import React from 'react';
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { Collapse, Menu, MenuItem, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import userInterface from '@/interfaces/Users/userData'
import ButtonComponent from '@/components/ButtonComponent';
import { HiChevronDown } from 'react-icons/hi2';
// import SwipeableViews from 'react-swipeable-views';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import DadosPessoais from './Leitura/DadosPessoais';
import Endereco from './Leitura/Endereco';
import Procurador from './Leitura/Procurador';
import Documentos from './Leitura/Documentos';
import DadosEmpresa from './Leitura/DadosEmpresa';

import DadosPessoaEditavel from './Editavel/DadosPessoa';
import DadosEmpresaEditavel from './Editavel/DadosEmpresa';
import EnderecoEditavel from './Editavel/Endereco';
import ProcuradorEditavel from './Editavel/Procurador';
import DocumentosEditavel from './Editavel/Documentos';
import SaveUser from '@/apis/postSaveUser';

import Loading from '../Loading';

interface Props {
    imovelData: imovelDataInterface
    type: "vendedores" | "compradores"
    returnData: any
    setOpen?: any
    setTituloCard?: any
}

interface TabsType {
    values?: userInterface[]
    selectTab: number
}

const Pessoa = ({ imovelData, type, returnData, setOpen, setTituloCard }: Props) => {

    const [blockSave, setBlockSave] = useState<any>([]);
    const [blocks, setBlocks] = useState([
        { name: 'dadosPessoais', status: false, leitura: DadosPessoais, editar: DadosPessoaEditavel },
        { name: 'dadosEmpresa', status: false, leitura: DadosEmpresa, editar: DadosEmpresaEditavel },
        { name: 'endereco', status: false, leitura: Endereco, editar: EnderecoEditavel },
        { name: 'procurador', status: false, leitura: Procurador, editar: ProcuradorEditavel },
        { name: 'documentos', status: false, leitura: Documentos, editar: DocumentosEditavel },
    ])
    const [loadingBlocks, setLoadingBlocks] = useState(false);

    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorMenu);
    const [tabs, setTabs] = useState<TabsType>({
        values: [],
        selectTab: 0
    });

    useEffect(() => {
        if (imovelData[type]) {
            setTabs({
                values: imovelData[type] || [],
                selectTab: tabs.selectTab || 0
            })
        }
    }, [imovelData, type]);

    const returnName = (item: userInterface) => {
        if (item.name) return capitalizeFirstWord(item.name)
        else if (item.razao_social) return item.razao_social.toUpperCase()
        else return 'ERROR - Nome não cadastrado'
    };

    function capitalizeFirstWord(str: string | undefined): string {
        if (!str) return ""
        const words = str.toLowerCase().split(' ');
        const capitalizedWords = words.map(word => {
            if (word.length > 2) return word.charAt(0).toUpperCase() + word.slice(1)
            else return word.charAt(0) + word.slice(1)
        });
        return capitalizedWords.join(' ');
    };

    const handleTab = async (value: any) => {
        blocks.forEach((bloco: any, index: number) => {
            bloco.status = false
        })

        setTabs({ ...tabs, selectTab: value });
        handleCloseMenu();
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorMenu(null);
    };

    // Editar e Salvar
    const handleShow = async (posicao: number, type: string) => {
        if (type === 'editar') {

            // Salva os dados do último bloco
            saveBlocks();

            if (blockSave?.bloco) {
                setOpen(true);

                switch (blockSave.bloco) {
                    case 1:
                        setTituloCard('Endereço')
                        break;

                    case 2:
                        setTituloCard('Procurador')
                        break;

                    case 3:
                        setTituloCard('Documentos pessoais')
                        break;

                    case 4:
                        setTituloCard('Documentos do imóvel')
                        break;

                    default:
                        break;
                }
            }
            else {
                // setOpen(false);]
                console.log('caiu AQUI no else')
                if (blockSave?.bloco === 0 && blockSave?.tipo_pessoa === 0) {
                    setTituloCard('Dados pessoais')
                    setOpen(true)
                }
                if (blockSave?.bloco === 0 && blockSave?.tipo_pessoa === 1) {
                    setTituloCard('Dados da empresa')
                    setOpen(true)
                }

            }

            // Passa o bloco atual para true
            blocks[posicao].status = true;

            // Passa todos os outros para false
            blocks.forEach((bloco: any, index: number) => {
                if (index !== posicao) {
                    bloco.status = false
                }
            })
        }
        else {
            // Caso clique no botão Salvar ou Voltar
            blocks[posicao].status = false;

            if (type === 'voltar') setBlockSave([]);
        }
        setBlocks([...blocks])
        console.log('OPEN: ' + open);
    }

    const saveBlocks = async () => {
        if (blockSave.length === 0) {
            console.log('não salva nada')
            setOpen(false)
        }
        else {

            // Ignora o que for enviado pelo bloco 4 que é referênte ao Documentos
            // Tudo é feito por dentro do componente

            setLoadingBlocks(true);
            console.log('salvar com: ', blockSave);
            // const res = await SaveImovel(blockSave) as any;
            // console.log("Res SaveImovel: ", res);


            if (blockSave.bloco !== 4) {
                const res = await SaveUser(blockSave) as any;
            }
            // console.log("Res SaveUser: ", res);

            await setBlockSave([]);
            await returnData();


            // setTabs({ ...tabs, selectTab: tabs.selectTab });


        }
        setLoadingBlocks(false);
    };
    if(type === 'vendedores') {
        console.log("Data: ", imovelData[type]);
        console.log("Tabs: ", tabs);
    };

    return (
        <div className={`detalhes-container ${type}`}>
            <Paper className='paper options'>
                <div className='names'>
                    {tabs.values?.map((item, index) => {
                        if (index < 5) {
                            return (
                                <div key={index} className='tooltip' >
                                    <ButtonComponent
                                        label={returnName(item)}
                                        id={index.toString()}
                                        name={tabs.selectTab === index ? 'name check' : 'name uncheck'}
                                        onClick={() => handleTab(index)}
                                        size={'medium'}
                                        variant={'text'}
                                    />
                                    <span className='tooltip-text'>{returnName(item)}</span>
                                </div>
                            )
                        }
                    })}
                </div>

                {!!tabs.values?.length && tabs.values?.length > 5 &&
                    <ButtonComponent
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleOpenMenu}
                        size={'medium'}
                        name='menu'
                        variant={'text'}
                        className={tabs.selectTab >= 5 ? 'check' : 'uncheck'}
                        startIcon={<HiChevronDown size={22} />}
                        label={"+" + (tabs.values?.length - 5)}
                    />
                }

                <Menu
                    id="resumo-menu"
                    anchorEl={anchorMenu}
                    className='resumo-menu'
                    open={open}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {tabs.values?.map((item, index) => {
                        if (index >= 5) {
                            return (
                                <MenuItem
                                    key={index}
                                    onClick={() => handleTab(index)}
                                    selected={index === tabs.selectTab}
                                    className={tabs.selectTab === index ? 'check' : 'uncheck'}
                                >
                                    <span className='box-name'>{returnName(item)}</span>
                                </MenuItem>
                            )
                        }
                    })}
                </Menu>
            </Paper>

            <SwipeableViews
                axis={'x'}
                index={tabs.selectTab}
                onChangeIndex={handleTab}
                className='swipe-container'
            >
                {tabs.values?.map((user, index) => (
                    index === tabs.selectTab && user.tipo_pessoa === 0 && !user.vinculo_empresa ?

                        // PESSOA FISICA
                        <div key={index} hidden={index !== tabs.selectTab} className='detalhes-container'>
                            {
                                blocks.map((block: any, index2: number) =>
                                    loadingBlocks === false ?
                                        (index2 !== 1) &&
                                        <>
                                            <div className='detalhes-container'>
                                                <Collapse orientation="vertical" in={block?.status === false} collapsedSize={0}>
                                                    <block.leitura pessoaData={user} handleShow={handleShow} index={index2} />
                                                </Collapse>

                                                {block?.status && imovelData.id && <Collapse orientation="vertical" in={block?.status === true} collapsedSize={0}>
                                                    <div className='detalhes-content'>
                                                        <block.editar
                                                            data={imovelData}
                                                            userData={user}
                                                            processoId={imovelData.id}
                                                            type={type}
                                                            index={index2}
                                                            handleShow={handleShow}
                                                            setBlockSave={setBlockSave}
                                                            saveBlocks={saveBlocks}
                                                        />
                                                    </div>
                                                </Collapse>}
                                            </div>
                                        </>
                                        :
                                        <Loading key={index2} />
                                )
                            }
                        </div>

                        : index === tabs.selectTab && user.tipo_pessoa === 0 && !!user.vinculo_empresa ?
                            // REPRESENTANTES PESSOA JURIDICA                    
                            <div key={index} hidden={index !== tabs.selectTab} className='detalhes-container'>
                                {
                                    blocks.map((block: any, index2: number) =>
                                        loadingBlocks === false ?
                                            (index2 === 0 || index2 === 4) &&
                                            <>
                                                <div className='detalhes-container'>
                                                    <Collapse orientation="vertical" in={block?.status === false} collapsedSize={0}>
                                                        <block.leitura pessoaData={user} handleShow={handleShow} index={index2} />
                                                    </Collapse>

                                                    {block?.status && <Collapse orientation="vertical" in={block?.status === true} collapsedSize={0}>
                                                        <div className='detalhes-content'>
                                                            <block.editar
                                                                data={imovelData}
                                                                userData={user}
                                                                processoId={imovelData.id}
                                                                type={type}
                                                                index={index2}
                                                                handleShow={handleShow}
                                                                setBlockSave={setBlockSave}
                                                                saveBlocks={saveBlocks}
                                                            />
                                                        </div>
                                                    </Collapse>}
                                                </div>
                                            </>
                                            :
                                            <Loading key={index2} />
                                    )
                                }
                            </div>

                            : index === tabs.selectTab && user.tipo_pessoa === 1 ?
                                // PESSOA JURIDICA
                                <div key={index} hidden={index !== tabs.selectTab} className='detalhes-container'>
                                    {
                                        blocks.map((block: any, index2: number) =>
                                            loadingBlocks === false ?
                                                (index2 === 1 || index2 === 2 || index2 === 4) &&
                                                <>
                                                    <div className='detalhes-container'>
                                                        <Collapse orientation="vertical" in={block?.status === false} collapsedSize={0}>
                                                            <block.leitura pessoaData={user} handleShow={handleShow} index={index2} />
                                                        </Collapse>

                                                        {block?.status && <Collapse orientation="vertical" in={block?.status === true} collapsedSize={0}>
                                                            <div className='detalhes-content'>
                                                                <block.editar
                                                                    data={imovelData}
                                                                    userData={user}
                                                                    processoId={imovelData.id}
                                                                    type={type}
                                                                    index={index2}
                                                                    handleShow={handleShow}
                                                                    setBlockSave={setBlockSave}
                                                                    saveBlocks={saveBlocks}
                                                                />
                                                            </div>
                                                        </Collapse>}
                                                    </div>
                                                </>
                                                :
                                                <Loading key={index2} />
                                        )
                                    }
                                </div>
                                : ""
                ))}
            </SwipeableViews>
        </div>
    )
}

export default Pessoa;
