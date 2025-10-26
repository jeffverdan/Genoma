import { ArrDocs, DeadlineTypes, retornoApi } from '@/interfaces/PosVenda/Agenda';
import axiosInstance from '../http/axiosInterceptorInstance';
import dayjs from 'dayjs';



async function getAgendaPos(responsavel_id?: string | number ): Promise<retornoApi[]> {
    let data: retornoApi[] = [];
    const token = localStorage.getItem('token');

    await axiosInstance.post('agenda_pos_venda', {
        responsavel_id,
    }, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
            //   const percentage = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100);
            // setProgressBar([{percent: percentage, status: 'active'}]);
        },
    })
        .then(res => {
            if (res !== undefined) {
                if (res.data.status && (res.data.status === 498 || res.data.status === 401)) {
                    //   localStorage.clear();
                } else {
                    console.log(res.data);                    
                    data = res.data.map((item: retornoApi) => {                        
                        const date = dayjs(item.data_assinatura).add(Number(item.prazo_escritura), 'd');                        
                        const itbiDocs = item.certidao.filter((doc) => doc.tipo.includes('ITBI'));
                        const certidoes = item.certidao.filter((doc) => !doc.tipo.includes('ITBI'))

                        const documentosFiltradosTiposRepetidos = certidoes.reduce<Record<number, ArrDocs>>((acc, doc) => {
                            const existingDoc = acc[Number(doc.id_dono_documento)];
                            
                            if (!existingDoc || doc.id_dono_documento !== existingDoc.id_dono_documento) {
                              acc[Number(doc.id_dono_documento)] = doc;
                            } else if (doc.id_dono_documento === existingDoc.id_dono_documento) {
                                if(new Date(doc.data_entrada_documento) > new Date(existingDoc.data_entrada_documento)) {
                                    acc[Number(doc.id_dono_documento)] = doc;
                                }
                            }
                            return acc;
                          }, {});
                        
                        const documentosFiltrados = itbiDocs.reduce<Record<number, ArrDocs>>((acc, doc) => {
                            const existingDocITBI = acc[doc.id];
                            
                            if (!existingDocITBI || new Date(doc.data_validade || doc.data_entrada_documento) > new Date(existingDocITBI.data_validade || existingDocITBI.data_entrada_documento)) {
                              acc[doc.id] = doc;
                            }
                            return acc;
                          }, {});

                        console.log(itbiDocs);
                        console.log(Object.values(documentosFiltrados));                        
                        
                        
                        return item = {
                            ...item,
                            dataEscritura: date,
                            dataEscrituraFormat: date.format('DD/MM/YYYY'),
                            itbi: Object.values(documentosFiltrados),
                            certidao: Object.values(documentosFiltradosTiposRepetidos)
                        }
                    })
                }
            }
        })

    return data;
}

export default getAgendaPos;