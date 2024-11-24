import DataTable from "react-data-table-component";
import styles from "./Table.module.css";
import Paginations from "../Paginations/Paginations";

interface RowData {
  id: number;
  full_name: string;
  email: string;
  position_applied: string;
  cv: string;
  mobile_number: string;
}

const estilos = {
  headCells: {
    style: {
      backgroundColor: "#278a7c",
      fontWeight: "bold",
      fontSize: 14,
      color: "#fff",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      backgroundColor: "#fff",
      "&:hover": {
        backgroundColor: "#e1e1e1",
      },
    },
  },
  table: {
    style: {
      borderRadius: "10px",
      overflowX: "auto",
    },
  },
  cells: {
    style: {
      className: styles.cellStyle,
    },
  },
};

const Tables = (props: any) => {
  const {
    columns,
    currentRecords,
    currentPage,
    recordsPerPage,
    totalRecords,
    onPageChange,
    selectable = false,
    customClass,
    maxWidth, // Keep maxWidth here to receive it from props
  } = props;
  return (
    <div
      className={`${styles.tables} ${customClass}`}
      style={{ maxWidth: maxWidth ? maxWidth : 'none' }} // Use maxWidth in style
    >
      <DataTable
        columns={columns}
        data={currentRecords}
        fixedHeader
        customStyles={estilos}
        fixedHeaderScrollHeight="100%"
        highlightOnHover
        selectableRows={selectable}
        selectableRowsHighlight={selectable}
        noHeader
        scroll={{ x: "auto" }}
      />
      {totalRecords > recordsPerPage && (
        <div className={styles.pagination}>
          <Paginations
            currentPage={currentPage}
            recordsPerPage={recordsPerPage}
            totalRecords={totalRecords ?? ""}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Tables;
