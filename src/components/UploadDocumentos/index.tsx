import Axios from "axios";
import classNames from "classnames";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import styles from "./file-picker.module.scss";
import InputMultiSelect from "../InputMultiSelect/Index";
import { SelectChangeEvent } from '@mui/material/Select';
import ButtonComponent from "../ButtonComponent";
import { Clear } from "@mui/icons-material";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { DocumentPlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import saveDocument from "@/apis/saveDocument";
import removeDocument from "@/apis/removeDocument";
// import getImovel from "@/apis/getImovel";
import GetProcesso from "@/apis/getProcesso";
import ShowDocument from "@/apis/getDocument";
import Tooltip from "@mui/material/Tooltip";
import saveTipoDocumento from "@/apis/saveTipoDocumento";
import SaveRecibo from "@/apis/saveReciboSinal";
import { HiExclamation } from "react-icons/hi";
import getReturnUserId from "@/apis/getReturnUserId";
import { useRouter } from "next/router";
import { Skeleton, Box, Alert } from "@mui/material";

import PostLocalizarSolicitacaoNucleo from "@/apis/postLocalizarSolicitacaoNucleo";
import SaveComprovantePagamento from "@/apis/saveComprovantePagamento";
import SaveComprovantePagamentoComissao from "@/apis/saveComprovantePagamentoComissao";
import { ListaDocumentosType } from "@/interfaces/Documentos";
import imovelDataInterface from '@/interfaces/Imovel/imovelData';
import { UseFormRegister } from "react-hook-form";
import { MultiDocsType } from "./Interfaces";
import InputText from "../InputText/Index";
import dateMask from "@/functions/dateMask";
import dayjs from "dayjs";
import SaveDataEmissaoDoc from "@/apis/saveDataEmissaoDocs";
import Pessoa from "@/interfaces/Users/userData";
import { Tipos } from "@/interfaces/Users/document";
import SaveComprovanteTransferencia from "@/apis/postSaveComprovanteTransf";
import { FaExclamationCircle } from "react-icons/fa";

type ContextType = {
  dataProcesso: imovelDataInterface,
  idProcesso: string,
  multiDocs: MultiDocsType[],
  setMultiDocs: (e: MultiDocsType[]) => void,
  setProgress?: (e: number) => void,
  setRes?: (e: any) => void,
}

interface FilePickerProps {
  pessoa: 'imovel' | 'vendedores' | 'compradores' | 'comprovante_transferencia' | 'corretor' | 'financeiro',
  idDonoDocumento?: string,
  option: ListaDocumentosType[],
  context: ContextType,
  register?: UseFormRegister<any>,
  errors?: any,
  idPedido?: number,
  pedidoDocumentoId?: number,
  idProcessoPedido?: number | string
  refresh?: any
  setAddRecibo?: any;
  userData?: Pessoa
  servicoId?: number | string
  origem?: string
  tipo?: 'usuario' | 'empresa'
  idParcela?: string | number
}

interface progress {
  percent: number
  status: string
  error?: string
}

const FilePicker: React.FC<FilePickerProps> = ({ servicoId, pessoa, idParcela, tipo, idDonoDocumento, option, context, register, errors, idPedido, pedidoDocumentoId, idProcessoPedido, refresh, setAddRecibo, userData, origem }) => {
  const {
    dataProcesso,
    idProcesso,
    multiDocs, setMultiDocs,
    setProgress,
    setRes
  } = context;

  console.log('UPLOAD PROCESSOID: ', context);
  console.log('Multidocs Componente: ', multiDocs)

  const router = useRouter();
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);
  const [newFiles, setNewFiles] = useState<boolean>(false);

  const emptyProgress: progress = { percent: 0, status: '', error: undefined };
  const [progressBar, setProgressBar] = useState<progress[]>([emptyProgress]);
  const uploadLimit = /*1048576*/ 52428800;
  const [loading, setLoading] = useState(false);
  const msgErrorTipo = '*Você precisa selecionar o tipo de documento.';
  const [msgDocumentoUnico, setMsgDocumentoUnico] = useState('');

  const tiposDoc = option[0]?.nome === 'recibo' || option[0]?.nome === 'boleto_financeiro' 
    ? ".pdf" 
    : option[0]?.nome === 'comissao' 
      ? ".pdf, .jpeg, .jpg, .png" 
      : option?.[0]?.nome === 'nota' 
        ? ".pdf, .jpeg, .jpg, .png, .doc, .docx" 
        : ".doc, .docx, .pdf";
  // console.log('OPTION: ' , option)

  // Usado para os Comprovantes Núcleo e Pós no Detalhes da Venda
  const idComprovanteNucleo: any = idPedido;
  const idComprovanteDocumento: any = pedidoDocumentoId;
  const idComprovanteProcesso: any = idProcessoPedido;

  console.log(dataProcesso);
  console.log('idDonoDocumento: ', idDonoDocumento)

  const recarregaDocs = async () => {
    setLoading(true);

    if (!!multiDocs[0]) {
      //RETORNANDO MULTIDOCS DO CONTEXT ANTERIOR
      console.log(multiDocs);
    } else {
      console.log(dataProcesso);
      // CASO NÃO SEJA PASSADO      

      const processo: imovelDataInterface = dataProcesso ? dataProcesso : await GetProcesso(idProcesso, router);
      const id: string = idDonoDocumento || '';
      console.log('PROCESSO: ', processo)

      const retornaUsuario = ((pessoa !== 'imovel' && pessoa !== 'comprovante_transferencia') && (pessoa !== 'corretor' && pessoa !== 'financeiro'))
        ? userData || ((!origem || origem !== 'nucleo') && origem !== 'financeiro' ? await getReturnUserId(id, idProcesso, router) : undefined) 
        : undefined;

      if (processo) {
        let documentos
        if (pessoa === 'imovel') {
          if (option[0]?.nome === 'recibo') {
            if (!processo.informacao?.recibo) {
              documentos = undefined
            }
            else {
              documentos = [{
                'id': processo.imovel_id || '',
                'info_id': processo.informacao?.id || '',
                'file': processo.informacao?.recibo || '',
                'item': []
              }];
              setAddRecibo(true)
            }
          }
          // else if(option?.[0]?.nome === 'nota'){
          //   if(processo.documentos?.data?.[0]){
          //       documentos = [{
          //       'id': processo?.imovel_id || '',
          //       'info_id': processo?.documentos?.data?.[0]?.id  || '',
          //       'file': String(processo?.documentos?.data?.[0]?.nome_original || ''),
          //       'item': []
          //     }]
          //   }
          //   else{
          //     documentos = undefined
          //   }
          // }
          else if (option[0]?.nome === 'comissao') {
            documentos = undefined
          }
          else {
            console.log('Carregou docs de ' + pessoa, processo?.imovel?.documentos);
            documentos = processo?.imovel?.documentos?.map((doc) => ({
              'id': doc.id || '',
              'file': doc.nome_original?.toString() || doc.arquivo || '',
              'item': !!doc.tipo_documento_ids[0]
                ? doc.tipo_documento_ids.map((items: Tipos) => ({
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
          }
        }
        else if(pessoa === 'corretor' || pessoa === 'financeiro'){
          if(option?.[0]?.nome === 'nota' || option?.[0]?.nome === 'boleto_financeiro'){
            if(processo.documentos?.data?.[0]){
                documentos = [{
                'id': processo?.imovel_id || '',
                'info_id': processo?.documentos?.data?.[0]?.id  || '',
                'file': String(processo?.documentos?.data?.[0]?.nome_original || ''),
                'item': []
              }]
            }
            else{
              documentos = undefined
            }
          }
        }
        else {
          //comprador ou vendedor
          //console.log('Carregou docs de ' + pessoa);

          if (!origem || origem !== 'nucleo') {
          console.log(retornaUsuario?.documentos?.data);

          if (!retornaUsuario?.documentos) {
            documentos = undefined
          }
          else {
            documentos = retornaUsuario?.documentos?.data?.map((doc) => ({
              'id': doc.id || '',
              'file': doc.nome_original?.toString() || doc.arquivo || '',
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
          }
          console.log(documentos);
          }
        }
        documentos && setMultiDocs([...documentos]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    recarregaDocs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProcesso])

  // MultiSelect
  const [selectValue, setSelectValue] = React.useState<string[]>([]);

  const handleMultiSelect = (e: SelectChangeEvent<typeof selectValue>, index: number) => {

    let {
      target: { value },
    } = e;
    console.log(value);

    setNewFiles(!!value);

    let arrPosicao: any = [];

    if (typeof value === 'string') {
      value = value.split(',')
    }

    if (value.length === 0) {
      multiDocs[index].item = [];
      setMultiDocs(multiDocs);
    }
    else if (value[0]) {
      value.forEach((elemento, index2) => {
        const tipo = option.find((e) => e.id === elemento);
        const item = {
          id: '',
          values: elemento,
          validade_dias: tipo?.validade_dias,
          nome: tipo?.nome
        };
        arrPosicao.push(item);
      });
      console.log(arrPosicao);


      multiDocs[index].item = arrPosicao;
      setMultiDocs(multiDocs);
      console.log(multiDocs);
    }

    setSelectValue(value);
  };

  // Salvar Tipo
  const handleSaveTipo = async () => {
    if (!newFiles) return;
    else setNewFiles(false);
    const usuarioId: any = localStorage.getItem('usuario_id');
    let arrayData = new FormData();
    arrayData.append('usuario_id', usuarioId);
    arrayData.append('processo_id', idProcesso);
    arrayData.append('papel', pessoa);

    const saveMultiDocs = async (el: any, index_documento: any) => {
      if (el.file && el.item[0]) {
        if (typeof (el.file) === 'string' || el.file instanceof String) {
          let arquivoVazio = new File(["foo"], "nao_teve_alteracao_foo.txt", {
            type: "text/plain",
          });
          arrayData.append(`arquivos[${index_documento}]`, arquivoVazio);
        } else {
          arrayData.append(`arquivos[${index_documento}]`, el.file);
        }
        if (el) {
          el.item.forEach((tipo: any, index_tipo: any) => {
            arrayData.append(`tipo_documento_ids[${index_documento}][${index_tipo}]`, tipo.values);
            arrayData.append(`multiplo_documento_id[${index_documento}][${index_tipo}]`, tipo.id ? tipo.id : "");
          })
        }
        arrayData.append(`documentos_ids[${index_documento}]`, el.id ? el.id : "");
        arrayData.append(`idDonoDocumento[${index_documento}]`, idDonoDocumento || '');
        //arrayData.append(`papel[${index_documento}]` ? `imovel_id` : `idDonoDocumento`, idDonoDocumento || '');
        arrayData.append((pessoa === 'imovel' || pessoa === 'corretor' || pessoa === 'financeiro') ? `imovel_id` : `id_dono_documento`, idDonoDocumento || '');
      }
      else {
        arrayData.append(`documentos_ids[${index_documento}]`, el.id ? el.id : "");
        arrayData.append((pessoa === 'imovel' || pessoa === 'corretor' || pessoa === 'financeiro') ? `imovel_id` : `id_dono_documento`, idDonoDocumento || '');
      }
    };

    // MULTIPLOS DOCUMENTOS EM 1 ARQUIVO PESSOA FISICA
    multiDocs.forEach((el: any, index_documento: any) => {
      saveMultiDocs(el, index_documento);
    });

    let res: any = await saveTipoDocumento(arrayData);
    if (setProgress) setProgress((pessoa === 'imovel' || pessoa === 'corretor' || pessoa === 'financeiro') ? Number(res?.porcenagem_preenchida_imovel) : res?.porcentagem_cadastro_concluida);
    if (res?.documentos) {
      const docs = res.documentos.map((doc: any) => ({
        id: doc.id,
        values: doc.tipo_documento_id,
        documento_id: doc.documento_id,
        validade_dias: doc.validade_dias,
        nome: doc.nome_tipo
      }));

      multiDocs.forEach((doc) => { doc.item = [] });
      multiDocs.forEach((doc) => {
        docs.forEach((e: any) => {
          if (e.documento_id === doc.id) {
            doc.item.push(e)
          }
        })
      })
    }
  };

  // Arquivos para upload
  const handleChange = async (e: any) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {

      //let array_index : any = [];
      let count_files: any = e.target.files.length;
      const countMultiDocs = multiDocs.length;

      let arr_files: [] = e.target.files;
      const comprimentoDoArray: any = arr_files.length;
      let valorUltimaPosicao: any;
      let verificaUltimo: boolean = false;

      for (let i = countMultiDocs; i < e.target.files.length + countMultiDocs; i++) {
        progressBar[i] = { percent: 0.1, status: 'active', error: '' };
        setProgressBar([...progressBar]);
      }

      for (let i = 0; i < e.target.files.length; i++) {
        // Atualiza o estado multiDocs de forma assÃ­ncrona
        const arrDoc: any = {
          id: '',
          file: e.target.files[i],
          item: [],
        };

        const newMultiDocs = [...multiDocs, arrDoc];
        const docToSave = newMultiDocs[newMultiDocs.length - 1];
        const lastIndex = newMultiDocs.length - 1;
        setMultiDocs([...newMultiDocs]);

        // Se for o último arquivo enviado do array, retorna true
        valorUltimaPosicao = arr_files[i];
        if (i === comprimentoDoArray - 1) {
          verificaUltimo = true;
        }

        await handleAutoSave(docToSave, lastIndex, count_files, verificaUltimo);
      }
    }
  };

  const handleDrop = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      let count_files: any = e.dataTransfer.files.length;
      const countMultiDocs = multiDocs.length;

      const qtdFiles = e.dataTransfer.files['length'];

      let arr_files: [] = e.dataTransfer.files;
      const comprimentoDoArray: any = arr_files.length;

      let verificaUltimo: boolean = false;

      for (let i = countMultiDocs; i < qtdFiles + countMultiDocs; i++) {
        progressBar[i] = { percent: 0.1, status: 'active', error: '' };
        setProgressBar([...progressBar]);
      }

      for (let i = 0; i < qtdFiles; i++) {
        setFiles((prevFiles: File[]) => [...prevFiles, e.dataTransfer.files[i]]);

        const arrDoc = {
          id: '',
          file: e.dataTransfer.files[i],
          item: [],
        };
        console.log(arrDoc);

        multiDocs.push(arrDoc);
        setMultiDocs(multiDocs);

        const docToSave = multiDocs[multiDocs.length - 1];
        const lastIndex = multiDocs.length - 1;

        // Se for o último arquivo enviado do array, retorna true        
        if (i === comprimentoDoArray - 1) {
          verificaUltimo = true;
        }

        handleAutoSave(docToSave, lastIndex, count_files, verificaUltimo);
      }
    }
  };

  // Salvar os arquivos
  const handleAutoSave = async (docToSave: any, index_Doc: any, count_files: any, verificaUltimo: boolean) => {

    let mimePdf = 'application/pdf';
    let mimeDoc = 'application/msword';
    let mimeDocx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    let mimeJpeg = 'image/jpeg';
    let mimePng = 'image/png';

    let res: any;

    if (docToSave?.file.type) {
      if (
          (((option[0]?.nome === 'recibo') || (option[0]?.nome === 'boleto_financeiro')) && docToSave?.file?.type !== mimePdf) ||
          ((option[0]?.nome === 'comissao') &&
            docToSave?.file?.type !== mimePdf &&
            docToSave?.file?.type !== mimeJpeg &&
            docToSave?.file?.type !== mimePng) ||
          ((option[0]?.nome === 'nota') &&
            docToSave?.file?.type !== mimePdf &&
            docToSave?.file?.type !== mimeJpeg &&
            docToSave?.file?.type !== mimePng ||
          (option[0]?.nome !== 'comissao' &&
            option[0]?.nome !== 'recibo' &&
            option[0]?.nome !== 'boleto_financeiro' &&
            option[0]?.nome !== 'nota' &&
            docToSave?.file?.type !== mimePdf &&
            docToSave?.file?.type !== mimeDoc &&
            docToSave?.file?.type !== mimeDocx)
      )){

        // progressBar[index_Doc] = { percent: 0, status: 'error', error: '*Arquivos devem estar no formato ' + tiposDoc + "." };
        // setProgressBar([...progressBar]);

        // evita que o File (objeto) seja mantido em doc.file — converte para string para não quebrar o render
        const fileName = docToSave?.file?.name || String(multiDocs[index_Doc]?.file || '');
        multiDocs[index_Doc] = {
          ...multiDocs[index_Doc],
          file: fileName,
        };
        setMultiDocs([...multiDocs]);

        progressBar[index_Doc] = { percent: 0, status: 'error', error: '*Arquivos devem estar no formato ' + tiposDoc + "." };
        setProgressBar([...progressBar]);

        return;
      }
      else {
        if (docToSave.file?.size > uploadLimit) {
          progressBar[index_Doc] = { percent: 0, status: 'error', error: `*O arquivo deve ter menos de 50MB` };
          setProgressBar([...progressBar]);
        }
        else if (option[0]?.nome === 'recibo') {
          const data = new FormData();
          setProgressBar([{ percent: 0, status: '' }])

          data.append('arquivo_recibo', docToSave.file);
          data.append('data_assinatura', dataProcesso.informacao?.data_assinatura || '');
          data.append('informacao_imovel_id', dataProcesso.informacao?.id || '');
          data.append('imovel_id', dataProcesso.imovel_id || '');
          data.append('usuario_id_logado', localStorage.getItem('usuario_id') || '');
          data.append('processo_id', idProcesso);

          res = await SaveRecibo({ data, setProgressBar });
          if (setRes) setRes(res);
          setAddRecibo(true);
        }
        else if (option[0]?.nome === 'comissao') {
          console.log('AQUI COMISSAO')
          const data = new FormData();
          setProgressBar([{ percent: 0, status: '' }])

          data.append('arquivo', docToSave.file);
          data.append('tipo', option[0]?.nome);
          data.append('processo_id', idProcesso);
          data.append('tipo_documento_id', '63');
          data.append('usuario_id', localStorage.getItem('usuario_id') || '');

          res = await SaveComprovantePagamentoComissao({ data, setProgressBar });
          if (setRes) setRes(res);
          setAddRecibo(true);
        }
        // else if (option[0]?.nome === 'boleto_financeiro') {
        //   const data = new FormData();
        //   setProgressBar([{ percent: 0, status: '' }])

        //   data.append('arquivo', docToSave.file);
        //   data.append('tipo', option[0]?.nome);
        //   data.append('processo_id', idProcesso);
        //   data.append('tipo_documento_id', '63');
        //   data.append('usuario_id', localStorage.getItem('usuario_id') || '');

        //   const recibo: any = await SaveComprovantePagamento({ data, setProgressBar });
        //   if (setRes) setRes(res);
        //   setAddRecibo(true);
        // }
        else if (option[0]?.nome === 'boleto') {
          console.log('AQUI BOLETO')
          const data = new FormData();
          setProgressBar([{ percent: 0, status: '' }])

          data.append('arquivo', docToSave.file);
          data.append('tipo', option[0]?.nome);
          data.append('id', idComprovanteNucleo);
          data.append('processo_id', idComprovanteProcesso);
          data.append('documento_id', '');
          data.append('tipo_documento_id', idComprovanteDocumento);
          data.append('usuario_id', localStorage.getItem('usuario_id') || '');

          for (const pair of data.entries()) {
            console.log(pair[0], pair[1]);
          }

          const recibo: any = await SaveComprovantePagamento({ data, setProgressBar });

          if (recibo) {
            refresh();
          }
        }
        else if (pessoa === 'comprovante_transferencia' && tipo && idParcela && idDonoDocumento) {
          res = await SaveComprovanteTransferencia({
            file: docToSave,
            processo_id: idProcesso,
            parcela_id: idParcela,
            usuario_id: idDonoDocumento,
            papel: tipo,
            setProgressBar, progressBar,
          })
        } else {
          // res = await saveDocument(idProcesso, docToSave, idDonoDocumento, pessoa === 'imovel' ? pessoa : pessoa.replace("es", ''), index_Doc, setProgressBar, progressBar, servicoId);
          res = await saveDocument(idProcesso, docToSave, idDonoDocumento, (pessoa === 'imovel' || pessoa === 'corretor' || pessoa === 'financeiro') ? pessoa : pessoa.replace("es", ''), index_Doc, setProgressBar, progressBar, servicoId, option, dataProcesso, setMsgDocumentoUnico);
          if (setRes) setRes(res);

          if (!!verificaUltimo) {
            progressBar[index_Doc] = { percent: 0, status: '', error: undefined };
            setProgressBar(progressBar);
          }

          if(option?.[0]?.nome === 'nota' || option?.[0]?.nome === 'boleto_financeiro') refresh();
        }
        if (res) {
          multiDocs[index_Doc] = {
            id: res.id_documento.id,
            file: res.id_documento.nome_original || res.id_documento.arquivo,
            item: []
          }

          if (option[0]?.nome === 'recibo') {
            multiDocs[index_Doc].info_id = res?.id_documento?.id
          };

          setMultiDocs([...multiDocs]);
          if (setProgress) setProgress((pessoa === 'imovel' || pessoa === 'corretor' || pessoa === 'financeiro') ? res?.porcenagem_preenchida_imovel : res?.porcentagem_cadastro_concluida);
        }
      }
    }
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  console.log(multiDocs);

  const removeFile = async (fileName: any, index: any) => {
    let idDocument: any;
    let res: any;

    console.log('DELETE MULTIDOCS: ' , multiDocs)

    if (multiDocs[index]?.id) {
      idDocument = option[0]?.nome === 'recibo' || option?.[0]?.nome === 'nota' ? multiDocs[index]?.info_id : multiDocs[index]?.id;
      console.log(idDocument);
      res = await removeDocument(idDocument, option[0]?.nome === 'recibo', pessoa);
      //if(setProgress) setProgress(res?.porcenagem_preenchida_imovel);
      if (setProgress) setProgress((pessoa === 'imovel' || pessoa === 'corretor' || pessoa === 'financeiro') ? Number(res?.porcenagem_preenchida_imovel) : res?.porcentagem_cadastro_concluida);

      if(option?.[0]?.nome === 'nota' || option?.[0]?.nome === 'boleto_financeiro') refresh();
    }

    if (option[0]?.nome === 'recibo' || option[0]?.nome === 'comissao') {
      setAddRecibo(false);
    }

    const newArr = [...files];
    newArr.splice(index, 1);
    setFiles([]);
    setFiles(newArr);
    setSelectValue([])

    multiDocs.splice(index, 1);
    setMultiDocs(multiDocs);

    progressBar.splice(index, 1);
    setProgressBar(progressBar);
  }

  const openFileExplorer = () => {
    inputRef.current.value = "";
    inputRef.current.click();
    setMsgDocumentoUnico('');
  };

  const handleOpenDoc = (id: number | string, type: string) => {
    if (option[0]?.nome === 'recibo') {
      type = option[0]?.nome;
      id = dataProcesso.imovel_id || 0;
    }

    if(option?.[0]?.nome === 'nota') {
      type = option[0]?.nome;
      id = dataProcesso?.documentos?.data?.[0]?.id || 0;
    }
    ShowDocument(id, type);
  };

  console.log(multiDocs);

  const handleData = (e: string, index: number, index_items: number, key: 'data_emissao' | 'validade_dias') => {
    if (key === 'data_emissao' && e.length > 10) return ''
    if (key === 'validade_dias' && !Number(e)) return ''
    multiDocs[index].item[index_items][key] = key === 'data_emissao' ? dateMask(e) : e;
    const dataEmissao = multiDocs[index].item[index_items].data_emissao || '';
    if (dataEmissao.length === 10) {
      const arrDate = dataEmissao.split('/')
      const date = dayjs(`${arrDate[2]}/${arrDate[1]}/${arrDate[0]}`);
      const prazo = Number(multiDocs[index].item[index_items].validade_dias);
      console.log(prazo);

      multiDocs[index].item[index_items].data_vencimento = date.add(prazo, 'day').format('DD/MM/YYYY');
    } else if (dataEmissao.length <= 9) {
      multiDocs[index].item[index_items].data_vencimento = ''
    }

    setMultiDocs([...multiDocs]);
  };

  const saveOnBlur = async (index: number, index_items: number, id: string | number) => {
    const res = await SaveDataEmissaoDoc({
      data_emissao: multiDocs[index].item[index_items].data_emissao || '',
      validade_dias: multiDocs[index].item[index_items].validade_dias || '',
      data_vencimento: multiDocs[index].item[index_items].data_vencimento || '',
      multiplo_documento_id: id
    })
    console.log("multiDocs: ", multiDocs);

    if (res) {
      dataProcesso.documentos?.data?.forEach((item) => {
        multiDocs.forEach((docs) => {
          docs.item.forEach((doc) => {
            if (doc.data_vencimento) {
              item.tipo_documento_ids.forEach(((e: Tipos) => {
                if (e.id === doc.id) {
                  e.data_emissao = doc.data_emissao || '',
                    e.data_vencimento = doc.data_vencimento || '',
                    e.validade_dias = doc.validade_dias || ''
                }
              }))
            }
          })
        })
      })
    }
  };

  return (
    <div className="multidocs">
      <div>
        {option?.length === 1 && multiDocs[0]?.id ? "" :
          <form
            className={styles.form_drop_files}
            onDragEnter={handleDragEnter}
            onSubmit={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onClick={openFileExplorer}
          >
            <input
              style={{ display: 'none' }}
              placeholder="fileInput"
              className="hidden"
              ref={inputRef}
              type="file"
              multiple={option?.length > 1}
              onChange={handleChange}
              // accept=".doc, .docx, .pdf"
              accept={tiposDoc}
            />

            <DocumentPlusIcon width={40} />

            <div className={styles.text}>
              Arraste um ou mais arquivos aqui
            </div>

            <div className={styles.text}>ou</div>

            <ButtonComponent size={"medium"} variant={"contained"} name={"upload"} label={"Escolha os arquivos"} />
          </form>
        }

        {
          loading === true
            ?
            <div style={{ display: 'flex' }}>
              <Skeleton animation="wave" height={100} width={213} style={{ marginRight: '10px' }} />
              <Skeleton animation="wave" height={100} width={460} />
            </div>

            :
            <div className={styles.row}>
              {multiDocs.map((doc, index) => (
                <>
                  <div className={styles.row}>
                    {/*Loading*/}
                    {
                      ((progressBar[index]?.percent > 0 && !doc.id)) ?
                        <div className={styles.loading_doc}>
                          <div className={styles.row}>
                            <div className={styles.label}>Carregando.. </div>
                            <div className={`style-bar ${styles.progressBar}`} style={{ width: '100%' }}>
                              <LinearProgress variant="determinate" value={progressBar[index]?.percent} />
                            </div>
                          </div>
                        </div>
                        :
                        ''
                    }

                    {(doc?.id || progressBar?.[index]?.status === 'error') &&
                      <>
                        <div key={index} className={styles.list}>
                          {option?.length > 1 && register &&
                            <InputMultiSelect
                              width="100"
                              label={""}
                              placeholder={'Tipos de documentos'}
                              option={option}
                              format={'multiSelectDocs'}
                              onClose={() => handleSaveTipo()}
                              value={doc.item.map((value) => value.values)}
                              disabled={progressBar[index]?.status === 'error'}
                              error={errors?.[index]?.tipoDocumento ? true : false}
                              sucess={doc?.item.length === 0 ? false : true}
                              {...register(index + '.tipoDocumento', {
                                required: !progressBar[index]?.error,
                                onChange: (e: SelectChangeEvent<string[]>) => handleMultiSelect(e, index),
                              })}
                            />
                          }
                          <div
                            className={`${styles.docs} ${progressBar[index]?.status === 'error' ? styles.error : ''}`}
                            onClick={(e) => handleOpenDoc(Number(doc.id || 0), 'documento')}
                          >
                            <Tooltip title="Ver documento">
                              <>
                                <span>{doc?.file}</span> <div className={styles.icons}>{progressBar[index]?.status === 'error' ? <HiExclamation className={styles.error_icon} /> : <CheckIcon className={styles.check_icon} />}</div>
                              </>
                            </Tooltip>
                          </div>

                          <ButtonComponent
                            aria-label="remove file"
                            onClick={() => removeFile(doc?.file, index)}
                            className={styles.btn_clear}
                            size={"medium"}
                            variant={"contained"}
                            startIcon={<Clear />}
                            name={""}
                            label={""}
                          />
                        </div>

                        <div >
                          {doc?.item?.map((item, index_items) => {
                            return !!item.validade_dias && option[0]?.nome !== 'boleto_financeiro' ? (
                              <div className={`validade_container ${!item.validade_dias ? 'hidden' : ''}`} key={index_items}>
                                <InputText
                                  label={'Documento'}
                                  value={item.nome}
                                  name="nome"
                                  disabled
                                />
                                <InputText
                                  label={'Validade dias'}
                                  width="100px"
                                  value={Number(item.validade_dias) ? item.validade_dias : ''}
                                  saveOnBlur={() => saveOnBlur(index, index_items, item.id)}
                                  name={index + '.validade_dias'}
                                  onChange={(e: { target: { value: string; }; }) => handleData(e.target.value, index, index_items, 'validade_dias')}
                                />
                                <InputText
                                  label={'Data emissão'}
                                  width="150px"
                                  value={item.data_emissao}
                                  saveOnBlur={() => saveOnBlur(index, index_items, item.id)}
                                  name={index + '.data_emissao'}
                                  onChange={(e: { target: { value: string; }; }) => handleData(e.target.value, index, index_items, 'data_emissao')}
                                />
                                <InputText
                                  label={'Vencimento'}
                                  width="140px"
                                  value={item.data_vencimento}
                                  name="data_vencimento"
                                  disabled
                                />
                              </div>
                            ) : <></>
                          })}
                        </div>

                        {
                          progressBar[index]?.error &&
                          <div className={styles.lineError}>
                            {progressBar[index].error}
                          </div>
                        }

                        {
                          errors?.[index]?.tipoDocumento &&
                          <div className={styles.lineError}>
                            {msgErrorTipo}
                          </div>
                        }
                      </>
                    }                    
                  </div>
                </>
              ))}
            </div>
        }

        {
          (!!msgDocumentoUnico && option[0]?.nome === 'boleto_financeiro')  ?
          <Alert 
            className='alert red red-msg'
            icon={<FaExclamationCircle size={20} />}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {msgDocumentoUnico}
          </Alert>
          :''
        }

      </div>
    </div>
  );
};

export default FilePicker;