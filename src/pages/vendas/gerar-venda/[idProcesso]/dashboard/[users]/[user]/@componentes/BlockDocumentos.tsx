import React, { useEffect, useContext, useState } from 'react';
import ButtonComponent from "@/components/ButtonComponent";
import InputText from "@/components/InputText/Index";
import { FieldErrors, useForm } from 'react-hook-form'
import styles from './BlocksStyles.module.scss'
import Image from "next/image";
import Single from "@/images/single.png";
import UsersContext from '@/context/Vendas/ContextBlocks';
import UploadDocumentos from '@/components/UploadDocumentos';
import { useRouter } from 'next/router';
import GetListaDocumentos from '@/apis/getListaDocumentos';
import Alert from '@mui/material/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
// import { setDocumentLoading } from '@cyntler/react-doc-viewer/dist/esm/store/actions';
import Skeleton from '@mui/material/Skeleton';

interface FormValues {
  tipoDocumento: string
}

type BlockProps = {
  handleNextBlock: (index: number) => void;
  handlePrevBlock: (index: number) => void;
  index: number;
  data: any;
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
    dataUsuario,
    loading,
    loadingDocumentos, setLoadingDocumentos
  } = useContext(UsersContext);

  console.log(data);
  
  const [multiDocs, setMultiDocs] = useState<any>([]);
  const [open, setOpen] = useState(true);
  const [openSecondTip, setopenSecondTip] = useState(true);
  const [openSecondVerific, setopenSecondVerific] = useState(false);

  const router: any = useRouter();
  const urlParam: any = router.query;
  const user: any = urlParam?.users;
  const pessoaUsuario: "vendedores" | "compradores" = urlParam?.users; // comprador ou vendedor

  const context = {
    dataProcesso,
    selectItem,
    idProcesso,
    multiDocs, setMultiDocs,
    progress, setProgress,
  };

  const {
    register,
    unregister,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      tipoDocumento: '',
    }
  });

  
  console.log(dataUsuario);


  const refreshDocs = () => { 
    const documentos = dataUsuario?.documentos?.data?.map((doc: any) => ({
      'id': doc.id || '',
      'file': doc.nome_original?.toString() || doc.arquivo || '',
      'item': !!doc?.tipo_documento_ids?.[0]
        ? doc.tipo_documento_ids?.map((items: any) => ({
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
    console.log(documentos);
    
    documentos && setMultiDocs([...documentos]);
  };

  useEffect(() => {
    refreshDocs();
  }, [dataUsuario]);

  // Ajuste Rafael
  let usuarioCadastroId;
  if (typeof window !== 'undefined') {
    // Verifique se o item existe no localStorage
    if (localStorage.getItem('usuario_cadastro_id') !== null) {
      // O item existe
      usuarioCadastroId = localStorage.getItem('usuario_cadastro_id') || dataUsuario?.id;
    } else {
      // O item não existe
      usuarioCadastroId = dataUsuario?.id || null
    }
  } else {
    // Se estiver no lado do servidor (durante a construção)
    usuarioCadastroId = dataUsuario?.id || null;
  }

  const idUsuario = (urlParam && urlParam.index && urlParam.index[0]) ? urlParam.index[0].toString() : usuarioCadastroId;
  const idRepresentante = (urlParam && urlParam.index && urlParam.index[2]) ? urlParam.index[2].toString() : usuarioCadastroId
  console.log(idUsuario);
  console.log(idRepresentante);
  const idDono = (urlParam && urlParam.index && urlParam.index[1])
    ? urlParam?.index[1] === 'representante'
      ? idRepresentante
      : idUsuario
    : idUsuario


  //const representanteUsuario = urlParam?.index ? urlParam?.index[1] : '';

  if (index === selectItem) {
    console.log("Form: ", watch());
    console.log("Error: ", errors);
    //console.log(multiDocs);
  };

  const handleClick = async (direction: string) => {
    if (direction === 'NEXT') {
      await handleNextBlock(index);
      router.push('/vendas/gerar-venda/' + urlParam.idProcesso + '/dashboard/' + pessoaUsuario);

    } else {
      handlePrevBlock(index);
    }
  };

  //pegando o valor de todos os tipos de todos os docs desse sujeito
  const dadosTipos = multiDocs;
  const valoresAgrupados: number[] = [];
  dadosTipos.forEach((objeto: { item: { values: number }[] }) => {
    objeto.item.forEach((item: { values: number }) => {
      valoresAgrupados.push(item.values);
    });
  });

  //logica para sumir a dica quando seleciona RG
  console.log(valoresAgrupados);
  useEffect(() => {
    if (openSecondVerific == false) {
      if (valoresAgrupados.some((item) => item === 20)) {
        setopenSecondTip(true);
      } else {
        setopenSecondTip(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valoresAgrupados]);

  const handleCloseTips = () => {
    setOpen(false);
  };

  const handleSecondCloseTips = () => {
    setopenSecondTip(false);
    setopenSecondVerific(true);
  };

  return (
    <>
      <div className={styles.containerBlock}>
        <div className={styles.headerBlock}>
          <h3>Insira {urlParam?.user === 'pessoa-juridica' && !urlParam?.index?.[1] ? 'o Contrato Social' : 'a RG'} e demais documentos de quem {user === 'vendedor' ? 'vende' : 'compra'}</h3>
          <p className="p1">Atenção: subir arquivos no formato .doc, .docx ou .pdf. e cada arquivo deve ter menos de 50MB</p>
        </div>

        <div className="content">
          {loadingDocumentos === false ? <UploadDocumentos
            register={register}
            errors={errors}
            context={context}
            pessoa={pessoaUsuario}
            // idDonoDocumento={idRepresentante === '' || idRepresentante === null ? idUsuario : idRepresentante}
            idDonoDocumento={idDono}
            option={listaDocumentos}
          />
            : <Skeleton animation="wave" height={300} />}
        </div>

        {open && (
          <Alert
            className='alert red'
            icon={<FaExclamationCircle size={20} />}
            onClose={handleSecondCloseTips}
            //severity='warning'
            variant="filled"
            sx={{ width: '100%', marginBottom: '5px' }}
          >
            {
              urlParam.user === 'pessoa-juridica' && !urlParam?.index?.[1]
                ? <>Atenção: A venda não será entregue sem o upload do <b>Contrato Social</b> de quem {user === 'vendedor' ? 'vende' : 'compra'}.</>
                : <>Atenção: A venda não será entregue sem o upload do <b>RG, CNH, RNE ou Passaporte</b> de quem {user === 'vendedor' ? 'vende' : 'compra'}.</>
            }

          </Alert>
        )}

        <div style={{ marginBottom: 5 }}>
          {open && (
            <Alert
              className='alert yellow'
              icon={<FaExclamationCircle size={20} />}
              onClose={handleCloseTips}
              //severity='warning'
              variant="filled"
              sx={{ width: '100%' }}
            >
              Os documentos <b>precisam estar legíveis</b> para que a equipe de pós-venda possa validar autenticidade.
            </Alert>
          )}
        </div>
        {openSecondTip && (
          <Alert
            className='alert yellow'
            icon={<FaExclamationCircle size={20} />}
            onClose={handleSecondCloseTips}
            //severity='warning'
            variant="filled"
            sx={{ width: '100%' }}
          >
            Se o CPF não constar na RG ou em outros documentos, realize o upload do CPF. <b>A pendência do CPF pode gerar devolução de venda</b>.
          </Alert>
        )}
        {Footer &&
          <Footer goToPrevSlide={() => handleClick("PREV")} goToNextSlide={handleSubmit(() => handleClick("NEXT"))} index={index} tipo="last_block" />}
      </div>
    </>
  );
};

export default BlockPage;