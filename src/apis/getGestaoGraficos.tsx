import axiosInstance from '../http/axiosInterceptorInstance';

async function getGestaoGraficos() {
    let data;
    // const responsavelId = localStorage.getItem('usuario_id');

    await axiosInstance.get('dashboard_coordenacao', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => {
            data = res.data;
            console.log('RETORNO :', res);               
            
        })
        .catch(err => {
            console.log(err);
        })    
    return data;
}

export default getGestaoGraficos;