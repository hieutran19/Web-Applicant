import Buttons from "../../../../components/filed/button/button";
import { useState } from "react";
import { Modal, Input} from "antd";
import { postOnHold } from "../../../../services/AxiosDetailApplicant";
import { AxiosError } from "axios";
import styles from "./onHold.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useLoading from "../../../../hooks/useLoading";
const { TextArea } = Input;

interface PassProps {
  status:string;
  id: string;
  checkOnHold:any;
  onUpdateSuccess: () => void;
}
const Onhold: React.FC<PassProps> = ({onUpdateSuccess,status, id, checkOnHold }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState("");
  const { setLoading } = useLoading();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const updatedCheckOnHold = !checkOnHold;
  const handleOk = async () => {
    const data = {
      id: id,
      is_on_hold:updatedCheckOnHold,
      comment: textValue,
    };
    try {
      setLoading(true);
      await postOnHold(data);
      onUpdateSuccess();
      toast.success("Updated successful");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Error submitting data:",
          error.response ? error.response.data : error.message
        );
        toast.error("Update error");
      }
    } finally {
      setLoading(false);
    }

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };
  const modalValue = checkOnHold ? 'Release' : 'Put On Hold'; 
  
  const modalTitle =checkOnHold ? 'Release Information' : 'On Hold Information'; 
  return (
    <>
      <Buttons
        className={styles.greenButton}
        // status="cancel"
        status={checkOnHold ? "primary" : "pause"}
        type="primary"
        handleClick={showModal}
        texts={modalValue}
      />
      <Modal
        footer={[
          <div className={styles.boxbutton}>
          <Buttons texts="OK" status="success"  handleClick={handleOk}>
            OK
          </Buttons>
          <Buttons  texts="Cancel" status="cancel" handleClick={handleCancel}> 
            Cancel
          </Buttons>
          </div>
        ]}
        className={styles.customModal}
        okText="Submit"
        centered
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={styles.textarea}>
          <p className={styles.requiredLabel}>Comment:</p>
          <TextArea
            placeholder="Your comments on CV"
            rows={4}
            value={textValue}
            onChange={handleTextChange}
          />
        </div>
      </Modal>
    </>
  );
};

export default Onhold;
