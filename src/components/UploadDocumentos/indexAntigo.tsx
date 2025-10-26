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
import { Skeleton, Box } from "@mui/material";
import ImovelData from "@/interfaces/Imovel/imovelData";
import PostLocalizarSolicitacaoNucleo from "@/apis/postLocalizarSolicitacaoNucleo";
import SaveComprovantePagamento from "@/apis/saveComprovantePagamento";
import SaveComprovantePagamentoComissao from "@/apis/saveComprovantePagamentoComissao";
interface FileItem {
  id: string;
  file: File;
}

interface FilePickerProps {
  uploadURL: string;
  type: string;
  pessoa: string,
  idDonoDocumento?: string,
  option: any,
  context: any,
  register?: any,
  unregister?: any,
  setValue?: any,
  watch?: any,
  clearErrors?: any,
  errors?: any,
  idPedido?: number,
  pedidoDocumentoId?: number,
  idProcessoPedido?: number | string
  refresh?: any
  setAddRecibo?: any;
}

interface progress {
  percent: number
  status: string
  error?: string
}

const FilePicker: React.FC<FilePickerProps> = ({ uploadURL, type, pessoa, idDonoDocumento, option, context, register, unregister, setValue, watch, clearErrors, errors, idPedido, pedidoDocumentoId, idProcessoPedido, refresh, setAddRecibo }) => {
  const {
    dataProcesso,
    imovelData,
    idProcesso,
    multiDocs, setMultiDocs,
    progress, setProgress,
    setRes
  } = context;

  // console.log('WATCH: ' , watch());
  // console.log('ERROR: ' , errors);
  // console.log(idDonoDocumento);

  // console.log(imovelData);
  // console.log(dataProcesso.imovel_id)
  // console.log(multiDocs);
  // console.log(idProcesso);
  // console.log(option)

  const router = useRouter();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);

  //const [progressBar, setProgressBar] = useState([emptyProgress]);
  const emptyProgress: progress = { percent: 0, status: '', error: undefined };
  const [progressBar, setProgressBar] = useState<progress[]>([emptyProgress]);
  const uploadLimit = /*1048576*/ 52428800;
  const [loading, setLoading] = useState(false);
  const msgErrorTipo = '*Você precisa selecionar o tipo de documento.';

  // console.log(idDonoDocumento);
  // console.log(pessoa);
  // console.log(option);
  // console.log(multiDocs);

  const tiposDoc = option?.[0] === 'recibo' ? ".pdf" : option?.[0] === 'comissao' ? ".pdf, .jpeg, .jpg, .png" : ".doc, .docx, .pdf";

  // Usado para os Comprovantes Núcleo e Pós no Detalhes da Venda
  const idComprovanteNucleo: any = idPedido;
  const idComprovanteDocumento: any = pedidoDocumentoId;
  const idComprovanteProcesso: any = idProcessoPedido;

  const recarregaDocs = async () => {
    setLoading(true);

    if (!!multiDocs[0]) {
      //RETORNANDO MULTIDOCS DO CONTEXT ANTERIOR
    } else {
      // CASO NÃO SEJA PASSADO      
      const processo: any = idProcesso ? await GetProcesso(idProcesso, router) : undefined
      const id: string = idDonoDocumento || '';
      // console.log(processo)
      // console.log(id)
      const retornaUsuario: any = pessoa !== 'imovel' ? await getReturnUserId(id, idProcesso, router) : '';
      //console.log(retornaUsuario);
      // console.log(processo);

      if (processo) {
        let documentos
        if (pessoa === 'imovel') {
          if (option?.[0] === 'recibo') {
            if (processo.informacao.recibo === null) {
              documentos = ''
            }
            else {
              documentos = [{
                'id': processo.imovel_id,
                'info_id': processo.informacao.id,
                'file': processo.informacao.recibo,
                'item': []
              }];
              console.log(documentos);
              setAddRecibo(true)
            }
          }
          else if (option?.[0] === 'comissao') {
            documentos = ''
          }
          else {
            console.log('Carregou docs de ' + pessoa);
            documentos = processo?.imovel?.documentos.map((doc: any) => ({
              'id': doc.id,
              'file': doc.nome_original || doc.arquivo,
              'item': doc.tipo_documento_ids.map((items: any) => ({
                'id': items.id || '',
                'values': items.tipo_documento_id,
              }))
            }))
          }
        }
        else {
          //comprador ou vendedor
          //console.log('Carregou docs de ' + pessoa);

          if (retornaUsuario?.length === 0) {
            documentos = ''
          }
          else {
            documentos = retornaUsuario?.documentos?.data.map((doc: any) => ({
              'id': doc.id,
              'file': doc.nome_original || doc.arquivo,
              'item': doc.tipo_documento_ids.map((items: any) => ({
                'id': items.id || '',
                'values': items.tipo_documento_id,
              }))
            }))
          }
        }
        setMultiDocs([...documentos]);

      }

    }
    setLoading(false);
  };

  useEffect(() => {
    recarregaDocs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // MultiSelect
  const [selectValue, setSelectValue] = React.useState<string[]>([]);

  const handleMultiSelect = (e: SelectChangeEvent<typeof selectValue>, index: any) => {
    let {
      target: { value },
    } = e;
    const valores: any = value;

    let arrPosicao: any = [];

    if (valores.length === 0) {
      multiDocs[index].item = [];
      setMultiDocs(multiDocs);
    }
    else {
      valores.forEach((elemento: any, index2: any) => {
        const item: any = { id: '', values: elemento };
        arrPosicao.push(item);
      });

      multiDocs[index].item = arrPosicao;
      setMultiDocs(multiDocs);
    }

    setSelectValue(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  // Salvar Tipo
  const handleSaveTipo = async (e: any, index: any) => {
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
        arrayData.append(pessoa === 'imovel' ? `imovel_id` : `id_dono_documento`, idDonoDocumento || '');
      }
      else {
        arrayData.append(`documentos_ids[${index_documento}]`, el.id ? el.id : "");
        arrayData.append(pessoa === 'imovel' ? `imovel_id` : `id_dono_documento`, idDonoDocumento || '');
      }
    };

    // (imovelData as ImovelData)?.devolucoes?.tipo_devolucao?.data.forEach(e => {
    //   console.log(e);
    //   if(e.tipo_pessoa === pessoa.replace("es", '') && e.tipo === "Incompleto") arrayData.append(`id_correcao`, e.id_correcao.toString());
    // })

    // MULTIPLOS DOCUMENTOS EM 1 ARQUIVO PESSOA FISICA
    multiDocs.forEach((el: any, index_documento: any) => {
      saveMultiDocs(el, index_documento);
    });

    let res: any = await saveTipoDocumento(arrayData);
    //if(setProgress) setProgress(res?.porcenagem_preenchida_imovel);
    console.log(res)
    if (setProgress) setProgress(pessoa === 'imovel' ? Number(res?.porcenagem_preenchida_imovel) : res?.porcentagem_cadastro_concluida);

    //await recarregaDocs();
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
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      let count_files: any = e.dataTransfer.files.length;
      const countMultiDocs = multiDocs.length;

      const qtdFiles = e.dataTransfer.files['length'];

      let arr_files: [] = e.dataTransfer.files;
      const comprimentoDoArray: any = arr_files.length;
      let valorUltimaPosicao: any;
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
        valorUltimaPosicao = arr_files[i];
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
      // if (((option[0] === 'recibo') && docToSave?.file?.type !== mimePdf) || ((option[0] === 'comissao') && docToSave?.file?.type !== mimePdf && docToSave?.file?.type !== mimeJpeg && docToSave?.file?.type !== mimePng) ||  (docToSave?.file?.type !== mimePdf && docToSave?.file?.type !== mimeDoc && docToSave?.file?.type !== mimeDocx)) {
      if (((option[0] === 'recibo') && docToSave?.file?.type !== mimePdf)
        || ((option[0] === 'comissao') && docToSave?.file?.type !== mimePdf &&
          docToSave?.file?.type !== mimeJpeg && docToSave?.file?.type !== mimePng)
        || (option[0] !== 'comissao' && option[0] !== 'recibo' &&
          docToSave?.file?.type !== mimePdf && docToSave?.file?.type !== mimeDoc &&
          docToSave?.file?.type !== mimeDocx)) {

        //progressBar[index_Doc].error = `*Arquivos devem estar no formato .doc, .docx ou .pdf. `;
        progressBar[index_Doc] = { percent: 0, status: 'error', error: '*Arquivos devem estar no formato ' + tiposDoc + "." };
        setProgressBar([...progressBar]);
      }
      else {
        if (docToSave.file?.size > uploadLimit) {
          //progressBar[index_Doc].error = `O arquivo deve ter menos de ${uploadLimit / (1024 * 1024)} MB`;
          progressBar[index_Doc] = { percent: 0, status: 'error', error: `*O arquivo deve ter menos de 50MB` };
          setProgressBar([...progressBar]);
        }
        else if (option[0] === 'recibo') {
          const data = new FormData();
          setProgressBar([{ percent: 0, status: '' }])

          data.append('arquivo_recibo', docToSave.file);
          data.append('data_assinatura', dataProcesso.informacao?.data_assinatura);
          data.append('informacao_imovel_id', dataProcesso.informacao?.id);
          data.append('imovel_id', dataProcesso.imovel_id);
          data.append('usuario_id_logado', localStorage.getItem('usuario_id') || '');
          data.append('processo_id', idProcesso);

          res = await SaveRecibo({ data, setProgressBar });
          if (setRes) setRes(res);
          setAddRecibo(true);
        }
        else if (option[0] === 'comissao') {
          const data = new FormData();
          setProgressBar([{ percent: 0, status: '' }])

          data.append('arquivo', docToSave.file);
          data.append('tipo', option[0]);
          data.append('processo_id', idProcesso);
          data.append('tipo_documento_id', '63');
          data.append('usuario_id', localStorage.getItem('usuario_id') || '');

          res = await SaveComprovantePagamentoComissao({ data, setProgressBar });
          if (setRes) setRes(res);
          setAddRecibo(true);
        }
        else if (option[0] === 'boleto') {
          const data = new FormData();
          setProgressBar([{ percent: 0, status: '' }])

          data.append('arquivo', docToSave.file);
          data.append('tipo', option[0]);
          data.append('id', idComprovanteNucleo);
          data.append('processo_id', idComprovanteProcesso);
          data.append('documento_id', '');
          data.append('tipo_documento_id', idComprovanteDocumento);
          data.append('usuario_id', localStorage.getItem('usuario_id') || '');

          for (const pair of data.entries()) {
            console.log(pair[0], pair[1]);
          }

          const recibo: any = await SaveComprovantePagamento({ data, setProgressBar });
          // if (setRes) {setRes(res);
          if (recibo) {
            // await PostLocalizarSolicitacaoNucleo(idComprovanteProcesso);
            refresh();
          }
        }
        else {
          res = await saveDocument(idProcesso, docToSave, idDonoDocumento, pessoa === 'imovel' ? pessoa : pessoa.replace("es", ''), index_Doc, setProgressBar, progressBar);
          if (setRes) setRes(res);
          // console.log('idDonoDocumento: ', idDonoDocumento)
          // console.log("RESULT SAVE DOCSSSS: ", res);
          // console.log('AQUI 3')

          if (!!verificaUltimo) {
            progressBar[index_Doc] = { percent: 0, status: '', error: undefined };
            setProgressBar(progressBar);
            //await recarregaDocs();
          }
        }

        console.log(res);
        if (res) {
          multiDocs[index_Doc] = {
            id: res.id_documento.id,
            file: res.id_documento.nome_original || res.id_documento.arquivo,
            item: []
          }

          if (option[0] === 'recibo') {
            multiDocs[index_Doc].info_id = res?.id_documento?.id
          };

          setMultiDocs([...multiDocs]);
          if (setProgress) setProgress(pessoa === 'imovel' ? res?.porcenagem_preenchida_imovel : res?.porcentagem_cadastro_concluida);
        }
      }
    }
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  // console.log(multiDocs);

  const removeFile = async (fileName: any, index: any) => {
    let idDocument: any;
    let res: any;

    if (multiDocs[index]?.id) {
      idDocument = option[0] === 'recibo' ? multiDocs[index]?.info_id : multiDocs[index]?.id;
      console.log(idDocument);
      res = await removeDocument(idDocument, option[0] === 'recibo', pessoa);
      //if(setProgress) setProgress(res?.porcenagem_preenchida_imovel);
      if (setProgress) setProgress(pessoa === 'imovel' ? Number(res?.porcenagem_preenchida_imovel) : res?.porcentagem_cadastro_concluida);
    }

    if (option[0] === 'recibo' || option[0] === 'comissao') {
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
    if (setProgress) setProgressBar(progressBar);

    // if (res) {
    //   console.log(1)
    //   const newArr = [...files];
    //   newArr.splice(index, 1);
    //   setFiles([]);
    //   setFiles(newArr);
    //   setSelectValue([])

    //   multiDocs.splice(index, 1);
    //   setMultiDocs(multiDocs);

    //   progressBar.splice(index, 1);
    //   setProgressBar(progressBar);

    //   setProgress(res?.porcenagem_preenchida_imovel);
    // }
  }

  const openFileExplorer = () => {
    inputRef.current.value = "";
    inputRef.current.click();
  };

  const handleOpenDoc = (id: number, type: string) => {
    if (option[0] === 'recibo') type = option[0]
    ShowDocument(id, type);
    //[ShowDocument((doc.item.id), 'documento'), btn.preventDefault()]
  };

  return (
    <div>
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
              multiple={option?.length !== 1}
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
              {
                Array.isArray(multiDocs) &&
                multiDocs.map((doc: any, index: any) => (
                  <>
                    <div style={{ marginBottom: '15px' }}>
                      {/*Loading*/}
                      {
                        ((progressBar[index]?.percent > 0 && !multiDocs[index].id)) ?
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

                      {(multiDocs[index].id || progressBar[index].status === 'error') &&
                        <>
                          <div key={index} className={styles.list}>
                            {option?.length > 1 &&
                              <InputMultiSelect
                                width="100"
                                label={""}
                                name={"tipoDocumento"}
                                placeholder={'Tipos de documentos'}
                                option={option}
                                format={'multiSelectDocs'}                                
                                onClose={(e: any) => handleSaveTipo(e, index)}
                                value={multiDocs[index]?.item.map((value: any) => value.values)}
                                context={context}
                                disabled={progressBar[index]?.status === 'error'}
                                error={errors?.[index]?.tipoDocumento ? true : false}
                                sucess={ multiDocs[index]?.item.length === 0 ? false : true}
                                {...register(index + '.tipoDocumento', {
                                  required: progressBar[index]?.error ? false : true,
                                  onChange: (e: SelectChangeEvent<string[]>) => handleMultiSelect(e, index),
                                })}
                              />
                            }

                            <div
                              className={`${styles.docs} ${progressBar[index]?.status === 'error' ? styles.error : ''}`}
                              onClick={(e) => handleOpenDoc(!doc.info_id ? doc.id : dataProcesso.informacao?.imovel_id, 'documento')}
                            >
                              <Tooltip title="Ver documento">
                                <>
                                  <span>{doc?.file?.name || doc?.file}</span> <div className={styles.icons}>{progressBar[index]?.status === 'error' ? <HiExclamation className={styles.error_icon} /> : <CheckIcon className={styles.check_icon} />}</div>
                                </>
                              </Tooltip>
                            </div>

                            <ButtonComponent
                              aria-label="remove file"
                              onClick={() => removeFile(doc?.file?.name, index)}
                              className={styles.btn_clear}
                              size={"medium"}
                              variant={"contained"}
                              startIcon={<Clear />}
                              name={""}
                              label={""}
                            />
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

      </div>
    </div>
  );
};

export default FilePicker;