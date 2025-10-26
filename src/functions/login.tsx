
import Axios from 'axios';

const links = {
    safebox: process.env.NEXT_PUBLIC_SAFEBOX_URL,
    laravel: process.env.NEXT_PUBLIC_SAFEBOX_API
}

export type LoginFormValues = {
    nome: string
    sobrenome: string
    email: string
    password: string
    remember: boolean
}

export const redirect = (perfil_logins: { nome: string }) => {
    if (perfil_logins.nome === "Gerente" || perfil_logins.nome === "Gerente Geral" || perfil_logins.nome === "Diretor Comercial") {
        return { message: '', path: '/vendas' }
    } else if (perfil_logins.nome === "Pós-venda" || perfil_logins.nome === "Coordenadora de Pós-Negociação") {
        return { message: '', path: '/posvenda' }
    } else if (perfil_logins.nome === "Apoio") {
        return { message: '', path: '/apoio' }
    } else if (perfil_logins.nome === "Núcleo") {
        return { message: '', path: '/nucleo' }
    } else if (perfil_logins.nome === "Corretor") {
        return { message: '', path: '/corretor' }
    } else if (perfil_logins.nome === "Financeiro") {
        return { message: '', path: '/financeiro' }
    } else if (perfil_logins.nome === "Admin") {
        const usuario_id = localStorage.getItem("usuario_id");
        const nome_usuario = localStorage.getItem("nome_usuario");
        const usuario_email = localStorage.getItem("usuario_email");
        const perfis_usuario = localStorage.getItem("perfis_usuario");
        const lojas_usuario = localStorage.getItem("lojas_usuario");
        const empresa_loja = localStorage.getItem("empresa_loja");
        const token = localStorage.getItem("token");
        if(!token) return { message: 'Erro, token não encontrado', path: '' }

        const params = new URLSearchParams({
            token: token,
            usuario_id: usuario_id ?? "",
            nome_usuario: nome_usuario ?? "",
            usuario_email: usuario_email ?? "",
            perfil_login: perfil_logins.nome ?? "",
            perfis_usuario: perfis_usuario ?? "",
            lojas_usuario: lojas_usuario ?? "",
            empresa_loja: empresa_loja ?? "",
        });
        // history.replace(``);
        return { message: 'redirect', path: `https://admin.genomatech.com.br/admin?${params.toString()}` }
    } else {
        console.log("ERROR, PERFIL: " + perfil_logins.nome + " NÃO CADASTRADO");
    }
};

export default async function onLogin(data: LoginFormValues) {
    try {
        const response = await Axios.post(links.laravel + 'login', data);
        if (response?.data?.status === "false" && !!response?.data?.message) {
            return { message: (`* ${response?.data.message || "Ops, servidor não está respondendo, tente novamente mais tarde."}`), path: '' }
        };
        const [perfil_logins] = response.data.perfil_logins.data;
        const [loja] = perfil_logins.loja;
        const perfisUsuario = response.data.perfil_logins.data.map((data: any) => data);
        const lojasUsuario = perfil_logins.loja.map((data: any) => data);

        localStorage.setItem('token', response.data.token);

        localStorage.setItem('usuario_id', response.data.user.id);
        localStorage.setItem('nome_usuario', response.data.user.name);
        localStorage.setItem('usuario_email', response.data.user.email);
        localStorage.setItem('perfil_login', perfil_logins.nome);
        localStorage.setItem('perfil_login_id', perfil_logins.id);
        localStorage.setItem('loja_id', loja ? loja.id : "");
        localStorage.setItem('perfis_usuario', JSON.stringify(perfisUsuario));
        localStorage.setItem('lojas_usuario', JSON.stringify(lojasUsuario));
        if (loja) {
            localStorage.setItem('empresa_loja', JSON.stringify([loja.empresa]) || '');
        }

        const res = redirect(perfil_logins);
        return res;
    } catch (error: any) {
        return { message: (`* ${error?.response?.data.error || error?.response?.data.message || "Ops, servidor não está respondendo, tente novamente mais tarde."}`), path: '' }
    }

};