import axiosInstance from '../http/axiosInterceptorInstance';

async function GetListBancos() {
    let data;
    const error = 'Erro ao retornar os Bancos';

    function capitalizeFirstWord(str: string | undefined): string {
        if (!str) return ""
        const words = str.toLowerCase().split(' ');
        const capitalizedWords = words.map(word => {
          if (word.length > 1) return word.charAt(0).toUpperCase() + word.slice(1)
          else return word.charAt(0) + word.slice(1)
        });
        return capitalizedWords.join(' ');
      };

    await axiosInstance.get('listbancos', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => {
            data = res.data?.data?.sort((a: any, b: any) => -b.nome?.localeCompare(a.nome));
            data?.forEach((e: {nome: string}) => e.nome = capitalizeFirstWord(e.nome.trim()))
            data = data?.sort((a: any, b: any) => -b.nome?.localeCompare(a.nome));
            console.log("List Bancos ", data);
        })
        .catch(err => {
            console.log(error);
        })
    return data;
}

export default GetListBancos;