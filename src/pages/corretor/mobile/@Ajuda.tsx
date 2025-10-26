import ButtonComponent from "@/components/ButtonComponent";
import { QUESTIONS } from "@/functions/QuestionsHelpCorretores";

interface PropsType {
    // QUESTIONS: QuestionsType
}

export default function Ajuda(props: PropsType) {    

    const onClickWhatsapp = () => {
        window.open('https://wa.me/5521992780407','_blank');
    };

    return (
        <div className="help-container">
            {/* <div className="btn-container">
                <h4>Estamos aqui para te ajudar</h4>
                <ButtonComponent variant="contained" size="large" label="Falar no WhatsApp" onClick={onClickWhatsapp} />
            </div> */}

            <div className="questions-container" style={{marginTop: '25px'}}>
                <div className="question-item">
                    <p className="title" style={{marginBottom: '0'}}>Perguntas frequentes</p>
                </div>

                {QUESTIONS?.map((question, index) => (
                    <div className="question-item" key={index}>
                        <p className="pergunta">{question.pergunta}</p>
                        <p className="resposta">{question.resposta}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}