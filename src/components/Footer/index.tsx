import React from 'react'
import Button from '@/components/ButtonComponent';
import LoadingBar from '@/components/LoadingBar';
import styles from './index.module.scss';
import Foguetes from '../Foguetes';
import { useRouter } from 'next/router';


const Footer = ({ progress, idProcesso, foguetes }: { progress: number, idProcesso: any, foguetes: string}) => {
    const router = useRouter();
    const qtdFoguetes = foguetes === '' || foguetes === null ? '0' : foguetes
    const returnFoguetes = () => {
        return parseInt(qtdFoguetes);
    };
    const quantidadeFogutes:number = returnFoguetes() as number;
    
    return (
        <footer>
            <div className={styles.footerPage}>
                <div className={styles.content}>
                    <div className={styles.progresso}>
                        <div className={styles.indicador}>
                            <span data-testid="status-value">{progress}%</span>
                            <span data-testid="footer-title">Progresso</span>
                        </div>

                        <div data-testid="footer-status-bar" className={styles.progressBar}>
                            <LoadingBar progress={progress} />
                        </div>

                        {/* <div className={styles.pontuacao}>
                            <div className={styles.infoFoguetes}>
                                <span data-testid="footer-points-label">Pontuação da Venda</span>
                                <Foguetes  quantidade={quantidadeFogutes} />
                            </div>
                            
                            <div className={styles.infoEtapas}>
                                <span data-testid="footer-steps">{'Falta' + ((5 - quantidadeFogutes) < 2 ? '' : 'm')} {5 - quantidadeFogutes} {'etapa' + ((5 - quantidadeFogutes) < 2 ? '' : 's')} para a entrega da sua venda!</span>
                            </div>
                        </div> */}
                    </div>

                    <div className={styles.btnFooter}>
                        <Button 
                            label="Ir para a entrega"
                            name="primary"
                            size="large"
                            variant='contained'
                            disabled={progress < 100}
                            data-testid="btn-footer"
                            onClick={() => idProcesso && router.push({
                                pathname: (`/vendas/entregar-venda/${idProcesso}/`),
                            })}
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;