import { toastEmitter } from '@/functions/toastEmitter';
import { ClipboardIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';

export default function CopyButton({ textToCopy }: { textToCopy: string | number | undefined }) {

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(textToCopy));
            toastEmitter("Copiado", "info");
            console.log('Text copied to clipboard');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <>
            {textToCopy && <Tooltip title="Copiar para área de transferência">
                <IconButton className='btn-copy' onClick={onCopy}>
                    <ClipboardIcon className='copy-icon' />
                </IconButton>
            </Tooltip>}
        </>
    )
}