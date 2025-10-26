import React, { useEffect, useContext, useState } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import { FieldErrors, useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import styles from './BlocksStyles.module.scss';
import Image from "next/image";
import Single from "@/images/single.png";
import ImovelContext from '@/context/Vendas/ContextBlocks';
import UploadDocumentos from '@/components/UploadDocumentos';
import { useRouter } from 'next/router';
import { FaExclamationCircle } from 'react-icons/fa';
import ImovelData from '@/interfaces/Imovel/imovelData';

interface FormValues {
  tipoDocumento: string
}

type BlockProps = {
  handleNextBlock: (index: number) => void;
  handlePrevBlock: (index: number) => void;
  index: number;
  data: ImovelData;
  Footer: React.FC<{
    goToPrevSlide: (index: number) => void;
    goToNextSlide: any;
    index: number;
    tipo?: string;
  }>
};

const BlockPage: React.FC<BlockProps> = ({ handleNextBlock, handlePrevBlock, index, data, Footer }) => {

  const {
    idProcesso,
    dataProcesso,
    selectItem, setDataSave,
    listaDocumentos,
    progress, setProgress,
  } = useContext(ImovelContext);

  const [multiDocs, setMultiDocs] = useState<any>([]);
  const [open, setOpen] = useState(true);
  const [openOnus, setOpenOnus] = useState(true);
  const [openVer, setopenVer] = useState(false);

  const context = {
    dataProcesso,
    selectItem,
    idProcesso,
    multiDocs, setMultiDocs,
    progress, setProgress,
    //loadingDocs, setLoadingDocs,
  }

  const userName = "Sr. Genoma"
  const errorMsg = 'Campo obrigatório';
  console.log(dataProcesso);

  const {
    register,
    unregister,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      tipoDocumento: '',
    }
  });

  const router = useRouter();
  const urlParam = router.query;
  //const user = urlParam.users;
  //const url: any = router.route.split('/'); // Usar para url sem parâmetro

  if (index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);
  };

  const handleClick = async (direction: string) => {
    if (direction === 'NEXT') {
      await handleNextBlock(index);
      router.push('/vendas/gerar-venda/' + urlParam.idProcesso + '/dashboard');

    } else {
      handlePrevBlock(index);
    }
  };

  const refreshDocs = () => {    
    const documentos = data?.imovel?.documentos.map((doc) => ({
      'id': doc.id || '',
      'file': doc.nome_original?.toString() || doc.arquivo  || '',
      'item': !!doc.tipo_documento_ids[0]
        ? doc.tipo_documento_ids.map((items) => ({
          'id': items.id || '',
          'values': items.tipo_documento_id || '',
          'validade_dias': items.validade_dias || null,
          'data_vencimento': items.data_vencimento || null,
          'data_emissao': items.data_emissao || null,
          'nome': items.nome_tipo
        }))
        : [/* {
          'id': doc.id,
          'values': doc.tipo_documento_id || '',
        } */]
    }))
    documentos && setMultiDocs([...documentos]);
  };
  
  useEffect(() => {
    refreshDocs();
  },[selectItem]);

  const handleCloseTips = () => {
    setOpen(false);
  };

  const handleCloseTipsOnus = () => {
    //setopenVer(true);
    setOpenOnus(false);
  };

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          <h3>Ônus reais e demais documentos do imóvel:</h3>
          <p className="p1">Atenção: Só serão aceitos arquivos em formato pdf. e com menos de 50MB.</p>
        </div>

        <div className="content">
          <UploadDocumentos
            register={register}
            errors={errors}
            context={context}
            pessoa="imovel"
            idDonoDocumento={dataProcesso?.imovel?.id}
            option={listaDocumentos} />
        </div>

        {/*Remover quando documentos não forem mais obrigatórios*/}
        <div>
          {openOnus && (
            <Alert
              className='alert red'
              icon={<FaExclamationCircle size={20} />}
              onClose={handleCloseTipsOnus}

              //severity='warning'
              variant="filled"
              sx={{ width: '100%', marginBottom: '5px' }}
            >

              Atenção: É obrigatório realizar o upload da <b>Ônus Reais</b> do <b>imóvel</b> para entregar a venda.
            </Alert>
          )}

          {open && (
            <Alert
              className='alert yellow'
              icon={<FaExclamationCircle size={20} />}
              onClose={handleCloseTips}
              //severity={feedbackRestaurar.error ? "error" : "success"}
              variant="filled"
              sx={{ width: '100%' }}
            >
              Os documentos <b>precisam estar legíveis</b> para que a equipe de pós-venda possa validar autenticidade.
            </Alert>
          )}
        </div>

        {/*Voltar quando documentos não forem mais obrigatórios*/}
        {/* {openOnus && (
          <Alert
            className='alert yellow'
            icon={<FaExclamationCircle size={20} />}
            onClose={handleCloseTipsOnus}
            
            //severity='warning'
            variant="filled"
            sx={{ width: '100%' }}
          >
            
            Acelere sua venda: tenha certeza de estar realizando o upload correto de <b>Ônus Reais</b>. 
          </Alert>
        )} */}

        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} tipo="last_block" />}
      </div>
    </>
  );
};

export default BlockPage;