import React, { DragEvent, useCallback, useRef } from "react";
import styles from "./drop-zone.module.scss";
import ButtonComponent from "../ButtonComponent";
import { HiDocumentPlus } from "react-icons/hi2";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

interface BannerProps {
  onClick: () => void;
  onDrop: (files: FileList) => void;
}

const Banner: React.FC<BannerProps> = ({ onClick, onDrop }) => {

  const handleDragOver = useCallback((ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    ev.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback((ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    onDrop(ev.dataTransfer.files);
  }, [onDrop]);

  return (
    <div
      className={styles.banner}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <DocumentPlusIcon width={40} />
      <span className={styles.banner_text}>Arraste um ou mais arquivos aqui dentro</span>
      <span className={styles.banner_text}>ou</span>
      <ButtonComponent size={"medium"} variant={"contained"} name={"upload"} label={"Escolha os arquivos"} /> 
    </div>
  );
};

interface DropZoneProps {
  onChange: (files: FileList) => void;
  accept?: string[];
}

const DropZone: React.FC<DropZoneProps> = ({ onChange, accept = ["*"] }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      onChange(ev.target.files!);
    },
    [onChange]
  );

  const handleDrop = useCallback((files: FileList) => {
    onChange(files);
  }, [onChange]);

  return (
    <div className={styles.wrapper}>
      <Banner onClick={handleClick} onDrop={handleDrop} />
      <input
        type="file"
        aria-label="add files"
        className={styles.input}
        ref={inputRef}
        multiple
        onChange={handleChange}
        accept={accept.join(",")}
      />
    </div>
  );
};

export { DropZone };
