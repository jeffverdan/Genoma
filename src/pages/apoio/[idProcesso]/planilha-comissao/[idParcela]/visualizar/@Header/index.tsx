import ButtonComponent from "@/components/ButtonComponent";
import { DadosProcessoType } from "@/interfaces/Apoio/planilhas_comissao";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";

interface PropsType {
    imovel: DadosProcessoType | undefined
    onVoltar?: () => void,
    title: string,
}

export default function Header (props: PropsType) {
    const { imovel, onVoltar, title } = props;

    return (
        <div className="header-page">
            <div className="content">
                <div className="nav">
                    <ButtonComponent
                        label="Voltar"
                        name="minimal"
                        size="medium"
                        variant="text"
                        id='btn-back'
                        startIcon={<ArrowBackIcon className="icon icon-left" />}
                        onClick={onVoltar}
                    />
                </div>
                <div className="title">
                    <h3>{title}</h3>
                </div>
            </div>
        </div>
    )

}