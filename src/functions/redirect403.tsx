type LocalType = 'comissão' | 'gerar-venda'
const redirect403 = async (statusProcesso: any, router: any, setSuspense: any, local?: LocalType) => {
    const perfilLogin = localStorage.getItem('perfil_login')
    if(!local && ((statusProcesso > 4 && statusProcesso < 8) || statusProcesso === 27) ||  perfilLogin === 'Gerente Geral'){
            // console.log('Redireciona')
            router.push('/403')
    }
    else if ((local === 'gerar-venda') && ((statusProcesso > 0 && statusProcesso < 8) || statusProcesso === 21 || statusProcesso === 26)) {
         // 1,2,3,4,5,6,7,21,26
         router.push('/vendas')
    }
    else{
        // console.log('Permite')
        setSuspense(false)
    }
}
export default redirect403;
