import React, {useState} from 'react';
import styles from './FooterRecibo.module.scss';
import CheckBox from '@/components/CheckBox';
import Button from '@/components/ButtonComponent';
import { FieldErrors, useForm } from 'react-hook-form'
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

interface FormValues {
    revisao: boolean
}

export default function FooterRecibo(props: any){
    const {
        register,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
        handleSubmit,
      } = useForm<FormValues>({
        defaultValues: {
          revisao: false
        }
    });

    const {handleDownload, downloadDate} = props

    const [checkedRevisao, setCheckedRevisao] = useState(true);
    const revisaoCheck = [
        { index: 0, label: "Revisei todas as informações do rascunho.", value: '', path: "", checked: checkedRevisao },
    ]

    const handleChecked = (e: any) => {
        console.log(e.target.checked)
        setCheckedRevisao(e.target.checked);

    }

    return (
        <footer className={styles.footerRecibo}>
            <div className={styles.content}>
                <div className={styles.checkRecibo}>
                    {revisaoCheck.map(({ index, label, value, path, checked }) => (
                        <CheckBox 
                            label={label}
                            value={value}
                            checked={checked}
                            path={path}
                            register={register}
                            key={index}
                            {...register('revisao', {
                            required: true,
                            onChange: (e) => handleChecked(e),
                            })}
                        />
                    ))}
                </div>
                
                {/* <div className={styles.infoDownload}>Download mais recente - 12/05/2023 às 16h20</div> */}

                <div className={styles.infoDownload}>
                    {!!downloadDate?.date && <p>Download mais recente - {downloadDate?.date} às {downloadDate?.hours}</p>}
                </div>

                <div className={checkedRevisao === true ? styles.btnActive : styles.btnDisable}>
                    <Button
                        name="primary"
                        size="large"
                        label="Fazer Download do rascunho"
                        startIcon={<DocumentArrowDownIcon className="icon icon-right icon-download" />}
                        endIcon={""}
                        disabled={!checkedRevisao}
                        error={false}
                        variant="text"
                        onClick={handleDownload}
                    />
                </div>
            </div>
        </footer>
    )
}