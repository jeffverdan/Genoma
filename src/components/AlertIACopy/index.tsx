import { Alert } from "@mui/material";
import { HiCheck } from "react-icons/hi2";

export default function AlertCopyIA() {


    return (
        <Alert
            className='alert yellow IA-copy'
            severity="warning"
            // icon={<HiCheck size={20} />}
        >
            Atenção aos campos que podem ter sido preenchidos com IA. Revise atentamente.
        </Alert>
    )
}