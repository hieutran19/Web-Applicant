import Buttons from "../../../../components/filed/button/button";
import { useState } from "react";
import { Modal, Input} from "antd";
import { updateFail } from "../../../../services/axiosApplicant";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./fail.module.css";
import useLoading from "../../../../hooks/useLoading";
import { getUserInfor } from "../../../../services/apiUser1";
const { TextArea } = Input;

interface PassProps {
  id: string;
  status: string;
  checkUsers:stringl
  onUpdateSuccess: () => void;
}

const fail: React.FC<PassProps> = ({ onUpdateSuccess, id, status, checkUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isTextAreaValid, setIsTextAreaValid] = useState(true);
  const { setLoading } = useLoading();


  const showModal = () => {
    const user = localStorage.getItem("user");
    if(user){
     
    const parsedUser = JSON.parse(user);
   if(status==='11'&& checkUsers.user==parsedUser.username){
    console.log("Username:", parsedUser.username);
    setIsModalOpen(false);
    toast.error("Need another HR to reject this candidate!");
   }else{
    setIsModalOpen(true);
   }
    
    }
  };

  const handleOk = async () => {
    if (!textValue.trim()) {
      setIsTextAreaValid(false); // Mark the TextArea as invalid
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
   
    
      await updateFail(data, config);
    
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
  const modalValue =
  status === '11'
    ? "Reject Candidate"
    : "Fail"; 
  
  const modalTitle =
  status === '11' 
    ? "Reject Candidate Confirmation"
    :status==='16'
    ?"Interview results information" 
    : "CV Scanning Confirmation";
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

export default fail;
