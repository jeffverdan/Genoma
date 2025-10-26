import { Skeleton } from "@mui/material"

const SkeletonAgendaRow = () => {
    return (
        <div className={`adress-container`}>
            <div className="header-adress">
                <Skeleton animation="wave" width={180} height={20} />
                <Skeleton animation="wave" width={80} height={20} />
            </div>
            <Skeleton animation="wave" width={500} height={40} />   
            <div className="deadline-row">
                <Skeleton animation="wave" width={500} height={40} />   
                <Skeleton animation="wave" width={170} height={40} />   
            </div>
            <div className="deadline-row">
                <Skeleton animation="wave" width={500} height={40} />   
                <Skeleton animation="wave" width={170} height={40} />   
            </div>
        </div>
    )
}

export { SkeletonAgendaRow }