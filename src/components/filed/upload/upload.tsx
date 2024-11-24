import { useEffect, useState } from "react";
import styles from "./upload.module.css";

export default function Uploads(props) {
  const {
    namecv,
    errors,
    id,
    name,
    onChange,
    labels,
    customClass,
    required,
    disabled = false,
    wrap = false,
  } = props;

  // Set the file name based on namecv
  const [selectedFileName, setSelectedFileName] = useState(
    namecv ? namecv.split("/").pop() : "No file information"
  );

  useEffect(() => {
    if (namecv) {
      setSelectedFileName(namecv.split("/").pop());
    } else {
      setSelectedFileName("No file information");
    }
  }, [namecv]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : "No file information");
    if (onChange) onChange(e);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById(id);

    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div>
      <div
        className={`${styles.inputs} ${customClass} ${wrap ? styles.wrap : ""}`}
      >
        {labels && (
          <label>
            {labels}: {required && <span className={styles.red}>*</span>}
          </label>
        )}

        <div
          onClick={triggerFileInput}
          className={`${styles.fileInputWrapper} ${
            disabled ? styles.disinput : ""
          }`}
        >
          {/* Make the file name clickable */}
          <span
            className={`${styles.fileName} ${
              selectedFileName === "No file information"
                ? styles.noFileInfo
                : ""
            }`}
          >
            {selectedFileName}
          </span>
          {/* Custom file label */}
          <label
            className={`${styles.customFileLabel} ${
              disabled ? styles.disableds : ""
            }`}
          >
            Upload
          </label>
          <input
            id={id}
            className={styles.hiddenFileInput}
            onChange={handleFileChange}
            name={name}
            disabled={disabled}
            type="file"
          />
        </div>
      </div>
      <div className={styles.formaterror}>
        {errors && <span className={styles.red}>{errors}</span>}
      </div>
    </div>
  );
}
