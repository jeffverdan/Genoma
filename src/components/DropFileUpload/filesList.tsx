import React, { useCallback } from "react";
// import CheckIcon from "../check";
// import ClearIcon from "../clear";
import styles from "./files-list.module.scss";
import { Check, Clear } from "@mui/icons-material";
import ButtonComponent from "../ButtonComponent";

interface FilesListItemProps {
  name: string;
  id: string;
  onClear: (id: string) => void;
  uploadComplete: boolean;
}

const FilesListItem: React.FC<FilesListItemProps> = ({
  name,
  id,
  onClear,
  uploadComplete,
}) => {

  const handleClear = useCallback(() => {
    onClear(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li className={styles.files_list_item}>
      <ButtonComponent className={styles.btn_name} size={"medium"} variant={"contained"} name={"name"} label={name} />
      {!uploadComplete ? (
        <ButtonComponent          
          aria-label="remove file"
          onClick={handleClear} 
          className={styles.btn_clear}
          size={"medium"} 
          variant={"contained"}
          startIcon={<Clear />}
          name={""} 
          label={""}
        />
      ) : (
        <span role="img" className={styles.file_list_item_check}>
          <Check />
        </span>
      )}
    </li>
  );
};

interface FilesListProps {
  files: { file: File; id: string }[];
  onClear: (id: string) => void;
  uploadComplete: boolean;
}

const FilesList: React.FC<FilesListProps> = ({ files, onClear, uploadComplete }) => {
  return (
    <ul className={styles.files_list}>
      {files.map(({ file, id }) => (
        <FilesListItem
          name={file.name}
          key={id}
          id={id}
          onClear={onClear}
          uploadComplete={uploadComplete}
        />
      ))}
    </ul>
  );
};

export { FilesList };
