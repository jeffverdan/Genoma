import { useEffect, useState } from "react";
import GetAllList from "@/apis/getAllList";


// Definir os tipos para a resposta da API
interface Laudemio {
    id: number;
    nome: string;
}

interface LaudemiosData {
    escrituras: Laudemio[];
    familias: Laudemio[];
    igrejas: Laudemio[];
}

const useLaudemiosData = () => {
    const [arrayEscritura, setArrayEscritura] = useState<{ id: string, name: string }[]>([]);
    const [laudemiosFamilia, setLaudemiosFamilia] = useState<{ id: string, name: string }[]>([]);
    const [laudemiosIgreja, setLaudemiosIgreja] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const data: LaudemiosData | any = await GetAllList();
                console.log(data)
                if (data) {
                    // Ajustar os dados recebidos para o formato desejado
                    setArrayEscritura([
                        { id: '0', name: 'Selecione o tipo de escritura' },
                        ...data.escrituras.map((item:any) => ({
                            id: String(item.id),
                            name: item.nome
                        }))
                    ]);

                    setLaudemiosFamilia([
                        { id: '0', name: 'Selecione...' },
                        ...data.familias.map((item:any) => ({
                            id: String(item.id),
                            name: item.nome
                        }))
                    ]);

                    setLaudemiosIgreja([
                        { id: '0', name: 'Selecione...' },
                        ...data.igrejas.map((item:any) => ({
                            id: String(item.id),
                            name: item.nome
                        }))
                    ]);
                } else {
                    console.error("Nenhum dado foi retornado da API.");
                }
            } catch (error) {
                console.error("Erro ao buscar os dados:", error);
            }
        };

        buscarDados();
    }, []);

    const tiposLaudemios = [
        { name: 'União, Prefeitura, Família ou Igreja', id: '0' },
        { name: 'União', id: '1' },
        { name: 'Prefeitura', id: '2' },
        { name: 'Família', id: '3' },
        { name: 'Igreja', id: '4' },
      ] as const;
    
      const listQuantLaudemios = [
        { name: 'Selecione...', id: '0' },
        { name: '1', id: '1' },
        { name: '2', id: '2' },
        { name: '3', id: '3' },
        { name: '4', id: '4' },
      ] as const;

    return { arrayEscritura, laudemiosFamilia, laudemiosIgreja, tiposLaudemios, listQuantLaudemios };
};


export default useLaudemiosData;
