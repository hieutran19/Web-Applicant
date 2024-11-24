import { useState, useEffect } from "react";
import { Modal } from "antd";
import styles from "../false/fail.module.css";
import Buttons from "../../../../components/filed/button/button";
import TextArea from "antd/es/input/TextArea";
import { postWithdraw } from "../../../../services/AxiosDetailApplicant";
import { toast } from "react-toastify";
import useLoading from "../../../../hooks/useLoading";

interface WithDrawProps {
  id: string;
  open: boolean;
  onUpdateSuccess: () => void;
  onUpdateError?: () => void;
  onCancel: () => void;
}

const WithDraw: React.FC<WithDrawProps> = ({
  id,
  open,
  onUpdateSuccess,
  onCancel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isTextAreaValid, setIsTextAreaValid] = useState(true);
  const { setLoading } = useLoading();
  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  const handleOk = async () => {
    // Validate if the TextArea has content
    if (!textValue.trim()) {
      setIsTextAreaValid(false); // Set validation state to false if empty
      toast.error("Please provide a reason for withdrawing.");
      return; // Stop execution if validation fails
    }

    const data = {
      id: id,
      comment: textValue,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await postWithdraw(data, config);
      setIsModalOpen(false);
      onUpdateSuccess();
      toast.success("Update Withdraw successful");
    } catch (error: unknown) {
      toast.error("Update Withdraw error");
    }finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onCancel();
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextValue(value);
    if (value.trim()) {
      setIsTextAreaValid(true);
    }
  };

  return (
    <Modal
      footer={[
        <div className={styles.boxbutton} key="footer-buttons">
          <Buttons
            texts="Submit"
            status="success"
            handleClick={handleOk}
          >
            Submit
          </Buttons>
          <Buttons
            texts="Cancel"
            status="cancel"
            handleClick={handleCancel}
          >
            Cancel
          </Buttons>
        </div>
      ]}
      centered
      title="Withdraw Interview"
      open={isModalOpen}
      onCancel={handleCancel}
      className={styles.customModal}
    >
      <div className={styles.textarea}>
        <p className={styles.requiredLabel}>
          Comment: <span className={styles.asterisk}>*</span>
        </p>

        <TextArea
          placeholder="Reason why this CV is withdrawn."
          rows={4}
          value={textValue}
          onChange={handleTextChange}
          className={!isTextAreaValid ? styles.invalid : ""}
        />
        {!isTextAreaValid && (
          <p className={styles.errorText}>This field is required.</p>
        )}
      </div>
    </Modal>
  );
};

export default WithDraw;
