import { Alert } from "@mui/material";
import { FaExclamationCircle } from "react-icons/fa";

const CardInfo = () => {

    return (
        <div className="card-revisar">
            <h3>
                Evite vendas devolvidas no futuro!
            </h3>
            <p>
            Revise sempre as informações da venda e certifique-se de que todos os documentos obrigatórios foram inseridos na plataforma. 
Além disso, preencha sempre todos os dados das partes envolvidas na venda. Lembre-se: Devoluções atrasam uma venda cujo prazo já está ativo.
            </p>
            <Alert className="alert info" icon={<FaExclamationCircle />}>
               <span className="alert-message">Assim que o pós-venda receber a venda revisada,, a venda volta para o status que estava na fila. Você pode acompanhar na aba </span>
               <span className="alert-message bold">Em andamento.</span>
            </Alert>

        </div>
    )
};

export default CardInfo;