import React, {useState, useContext, useEffect} from 'react'
import Button from '@/components/ButtonComponent';
import LoadingBar from '@/components/LoadingBar';
import styles from './index.module.scss';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import UsersContext from '@/context/UsersContext';
import GlobalContext from '@/context/GlobalContext';


export default function FooterCard({ progress, saveImovel, idProcesso } : { progress : number, saveImovel: () => void, idProcesso: number}) { 
    const quantidadeFogutes:number = 1;
    const router = useRouter();
    const routerQuery = router.query;
    const param: any = routerQuery.users;
    // console.log(router);
    // console.log(param);
    // console.log(routerQuery);
    // console.log(typeof(progress));

    const {
        concluirForm
    } = useContext(UsersContext);

    const handleClick = () => {
        saveImovel();

        let redirect: string;

        switch (param) {
            case 'vendedor':
                redirect = 'vendedor'
                break;
            
            case 'comprador':
                redirect = 'comprador'
                break;
        
            default:
                redirect = ''
                break;
        }

        router.push({
            pathname: (`/vendas/gerar-venda/${idProcesso}/dashboard/${redirect}`),
        })
    };

    function labelBtn(){
        let label: string;

        switch (param) {
            case 'vendedor':
                label = 'Concluir cadastro'
                break;
            
            case 'comprador':
                label = 'Concluir cadastro'
                break;
        
            default:
                label = 'Concluir cadastro de imóvel'
                break;
        }

        // console.log(label)

        return label;
    }
    
    return (
        <footer>
            <div className={styles.footerPage}>
                <div className={styles.content}>
                    <div className={styles.progresso}>
                        <div className={styles.indicador}>
                            <span data-testid="status-value">{Math.round(progress)}%</span>                            
                        </div>

                        <div data-testid="footer-status-bar" className={styles.progressBar}>
                            <LoadingBar progress={progress} />
                        </div>
                        
                        {/*Remover quando documentos não forem mais obrigatórios*/}
                        {
                            !param && router.route.split('/')[5] !== 'comissao'
                            ? <p>Para chegar em <b>100%</b> você precisa ter o documento da <b>Ônus Reais</b></p>
                            : routerQuery.user === 'pessoa-juridica' && !routerQuery?.index?.[1]
                                ? <p>Para chegar em <b>100%</b> você precisa ter o documento do <b>Contrato Social</b></p>
                                : routerQuery.user === 'pessoa-juridica' && routerQuery?.index?.[1] === 'representante' || routerQuery.user === 'pessoa-fisica'
                                    ? <p>Para chegar em <b>100%</b> você precisa ter pelo menos um documento de <b>RG, CNH, RNE ou Passaporte</b></p>
                                    : ''
                        }
                    </div>

                    <div className={styles.btnFooter}>
                        <Button 
                            label={labelBtn()}
                            name="primary"
                            size="large"
                            variant='contained'
                            disabled={progress !== 100 || concluirForm === false}
                            data-testid="btn-footer"
                            fullWidth
                            onClick={() => handleClick()}
                            endIcon={<CheckIcon />}
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}
