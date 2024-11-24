import Buttons from "../../../../components/filed/button/button";
import { useState } from "react";
import { Modal, Input} from "antd";
import { postAccept_decline_offer } from "../../../../services/AxiosDetailApplicant";
import { AxiosError } from "axios";
import styles from "../pass/pass.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useLoading from "../../../../hooks/useLoading";
const { TextArea } = Input;

interface PassProps {
  status:string;
  id: string;
  onUpdateSuccess: () => void;
}
const AcceptOffer: React.FC<PassProps> = ({onUpdateSuccess,status, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState("");
  const { setLoading } = useLoading();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const data = {
      id: id,
      action:'accept',
      comment: textValue,
    };
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      const config = {
        headers: {
          Authorization: `Bearer  ${token}`,
        },
      };
      await postAccept_decline_offer(data, config);
      onUpdateSuccess();
      toast.success("Accept offer successfull");
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
  const modalValue =
  status === '1' || status === '3' || status === '5'
    ? "Pass"
    : status === '8'
    ? "Accept Offer"
    : "Default Confirmation"; 
  
  const modalTitle =
  status === '1' 
    ? "CV Scanning Confirmation" 
    : status === '3' 
    ? "Interview Board Confirmation"
    : status === '5' 
    ? "Interview Confirmation" 
    : status === '8'
    ? "Accept Offer Confirmation "
    : "Default Confirmation";
  return (
    <>
      <Buttons
        className={styles.greenButton}
        status="success"
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

export default AcceptOffer;
