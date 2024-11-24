import { Pagination } from 'antd';
import styles from './Paginations.module.css';

interface PaginationsProps {
  totalRecords: number;
  recordsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Paginations({
  totalRecords,
  recordsPerPage,
  currentPage,
  onPageChange,
}: PaginationsProps) {
  return (
    <Pagination
      className={styles.pagination}
      total={totalRecords}
      pageSize={recordsPerPage}
      current={currentPage}
      onChange={onPageChange}
      showQuickJumper
      showTotal={(total) => `Total ${total} records`}
      size="small"
      showSizeChanger={false}
    />
  );
}
