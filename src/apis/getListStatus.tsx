import axiosInstance from '../http/axiosInterceptorInstance';

async function getListStatus() {
  const token = localStorage.getItem('token');
  let data;

  await axiosInstance.get('progressstatus', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }).then(res => {
    if (res !== undefined) {
      if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {

      } else {
        data = res.data.data.map((value: { id: number; status: string; }) => ({ "id": value.id, "label": value.status }));
        console.log(res.data);        
      }
    }
  }).catch(err => {
    console.log(err);
  })

  return data;
};

export default getListStatus;