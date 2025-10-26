import { QUESTIONS } from "@/functions/QuestionsHelpCorretores";
import { QuestionsType } from "@/interfaces/Corretores";
import { Avatar, Chip, Collapse } from "@mui/material";
import { useState } from "react";

interface PropsType {    
    // QUESTIONS: QuestionsType
}

export default function RecentQuestions(props: PropsType) {    
    const [collapse, setCollapse] = useState([
        { question: 0, value: false },
        { question: 1, value: false },
        { question: 2, value: false },
    ])

    const onCollapse = (index: number) => {
        collapse[index].value = !collapse[index].value;
        setCollapse([...collapse]);
    };    

    return (
        <div className="recent-questions">
            <h4>Perguntas frequentes</h4>
            <div className="questions-container">
                {QUESTIONS?.filter((e, i) => i < 3).map((question, index) => (
                    <div className="card" key={index} onClick={() => onCollapse(index)}>
                        <p className="title">{question.pergunta}</p>
                        <Collapse in={collapse[index].value} timeout={600}>
                            <p className="subtitle"> {question.resposta}</p>
                        </Collapse>
                    </div>
                ))}
            </div>
        </div>
    )
}