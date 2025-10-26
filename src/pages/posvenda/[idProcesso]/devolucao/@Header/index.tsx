import ButtonComponent from "@/components/ButtonComponent";
import { Chip, Avatar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ButtonSalvarSair from '@/components/ButtonSalvarSair';
import ImovelData from "@/interfaces/Imovel/imovelData";
import Pessoa from "@/interfaces/Users/userData";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

interface Props {
    imovel?: ImovelData
    gerente?: {
        data: Pessoa[]
    }
    readyOnly: boolean
}

const HeaderDevolucao = (props: Props) => {
    const { imovel, gerente, readyOnly } = props;
    const nomeGerente = gerente?.data[0]?.name;
    const lojaGerente = gerente?.data[0]?.loja?.data[0]?.nome;
    const router = useRouter();

    return (
        <div className="header-devolucao">
            {readyOnly ?
                <ButtonComponent
                    label="Voltar"
                    name="minimal"
                    size="medium"
                    variant="text"
                    id='btn-back'
                    startIcon={<ArrowBackIcon className="icon icon-left" />}
                    onClick={() => router.back()}
                />
                :
                <ButtonComponent
                    label={'Salvar e Sair'}
                    name="secondary"
                    size="medium"
                    variant="outlined"
                    id='btn-salvar-sair'
                    startIcon={<ArrowLeftOnRectangleIcon className="icon icon-left" />}
                    onClick={() => router.back()}
                />
                // : <ButtonSalvarSair url={'/posvenda/'} />
                }

            <section className="info-header">
                <div className="address-devolucao">
                    <div className="row">
                        <LocationOnIcon className="svg" />
                        <span className="bairro">{`${imovel?.bairro} - ${imovel?.uf}`}</span>
                    </div>
                    <div className="row">
                        <span className="logradouro">{`${imovel?.logradouro}, ${imovel?.numero}`}</span>
                        <Chip className='chip green' label='Financiamento' />
                        <Chip className='chip green' label='FGTS' />
                    </div>
                </div>

                <div className="gerente-container">
                    <Avatar sx={{ width: 67, height: 67, bgcolor: '' }} alt="Angela Maria" />

                    <div className="gerente-info">
                        <p className="funcao">Gerente</p>
                        <p className="name">{`${nomeGerente}`}</p>
                        <p className="local">{`${lojaGerente}`}</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeaderDevolucao;