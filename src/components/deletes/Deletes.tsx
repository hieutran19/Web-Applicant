import { Modal } from 'antd';
import styles from './deletes.module.css';
import Buttons from '../filed/button/button';

export default function Deletes(props: any) {
  const { open, handleOk, handleCancel, title, type } = props;
  return (
    <Modal className="modal" title={title} open={open} centered onCancel={handleCancel} footer={false}>
      <div className={styles.modalContent}>Are you sure you want to delete this {type}?</div>
      <div className="buttonBox">
        <Buttons texts="OK" status="success" handleClick={handleOk} />
        <Buttons texts="Cancel" status="cancel" handleClick={handleCancel} />
      </div>
    </Modal>
  );
}
