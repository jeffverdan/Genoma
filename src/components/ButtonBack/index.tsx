import React from 'react'
import Button from '../ButtonComponent';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ButtonBack() {

    const router = useRouter();

    return (
        <Button
            label="Voltar"
            name="minimal"
            size="medium"
            variant="text"
            id='btn-back'
            startIcon={<ArrowBackIcon className="icon icon-left" />}
            onClick={() => router.back()}
        />
    )
}
