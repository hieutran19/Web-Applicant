import Buttons from "../../../../components/filed/button/button";
import { useState } from "react";
import { Modal, Input} from "antd";
import { postReject_candidate } from "../../../../services/AxiosDetailApplicant";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../false/fail.module.css";
import useLoading from "../../../../hooks/useLoading";
const { TextArea } = Input;

interface PassProps {
  id: string;
  status:string;
  onUpdateSuccess: () => void;
}

const rejectCandidate: React.FC<PassProps> = ({ onUpdateSuccess, id, status}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isTextAreaValid, setIsTextAreaValid] = useState(true);
  const { setLoading } = useLoading();


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    if (!textValue.trim()) {
      setIsTextAreaValid(false); 
      toast.error("Please provide a reason before submitting.");
      return;
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
   
    
      await postReject_candidate(data, config);
    
      onUpdateSuccess();
      toast.success("Updated successfully");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
       
        toast.error("You should rate this CV!");
      } 
    }finally {
      setLoading(false);
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextValue(value);
    if (value.trim()) {
      setIsTextAreaValid(true);
    }
  };
  const modalValue = "Reject"; 
  
  const modalTitle = "Reject Candidate Confirmation";
  return (
    <>
      <Buttons
        status="danger"
        type="primary"
        handleClick={showModal}
        texts={modalValue}
      />
      <Modal
        width={600}
        footer={[
          <div className={styles.boxbutton}>
            <Buttons texts="OK" status="success" handleClick={handleOk}>
              Submit
            </Buttons>
            <Buttons texts="Cancel" status="cancel" handleClick={handleCancel}>
              Cancel
            </Buttons>
          </div>,
        ]}
        title={modalTitle}
        okText="Submit"
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={styles.textarea}>
          <p className={styles.requiredLabel}>
            Comment: <span className={styles.asterisk}>*</span>
          </p>

          <TextArea
            placeholder="Reason this CV was rejected."
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
    </>
  );
};

export default rejectCandidate;
