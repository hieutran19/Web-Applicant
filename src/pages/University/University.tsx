import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Input } from "antd";
import styles from "../University/University.module.css";
import Tables from "../../components/Table/Tables";
import { getUniversity, deleteUniversity } from "../../services/axiosApplicant";
import { toast, ToastContainer } from "react-toastify";
import Tiles from "../../components/titles/Title";
import useLoading from "../../hooks/useLoading";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AddUniversity from "./CreateUniversity/CreateUniversity";
import Buttons from "../../components/filed/button/button";
import Deletes from "../../components/deletes/Deletes";
import UpdateUniversity from "./editUniversity/UpdateUniversity";
import Authorize from "../../components/authorize/Authorize";

const { Search } = Input;

interface RowData {
  id: number;
  name: string;
  english_name: string;
  original_name: string;
  country: number;
  location: string;
  ranking: number;
  country_short_name: string;
}

interface ApiResponse {
  university: RowData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const University = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editId, setEditId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const [currentRecords, setCurrentRecords] = useState<RowData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const recordsPerPage = 6;
  const [openAdd, setOpenAdd] = useState(false);
  const { setLoading } = useLoading();

  const fetchUniversity = async () => {
    setLoading(true);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    setCurrentPage(page);
    try {
      const params = {
        page,
        per_page: recordsPerPage,
        search,
      };
      const response = await getUniversity(params);
      const apiResponse: ApiResponse = response.data;
      setCurrentRecords(apiResponse.university);
      setTotalRecords(apiResponse.total);
    } catch (error) {
      console.error("fetch university error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversity();
  }, [searchParams]);

  const showEdit = (row: any) => {
    setEditId(row?.id);
    setOpenEdit(true);
    console.log("dvaf");
  };

  const showDelete = (row: any) => {
    setDeleteId(row?.id);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    const data = {
      id: deleteId,
    };
    try {
      await deleteUniversity(data);
      fetchUniversity();
      setOpenDelete(false);
      toast.success("University deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("University deleted error");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Name",
      maxWidth: "15%",
      selector: (row: RowData) => row.name,
      sortable: true,
      cell: (row: RowData) => (
        <Link
          style={{
            whiteSpace: "unset",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          to={`/university/${row.id}`}
        >
          {row.name}
        </Link>
      ),
    },
    {
      name: "English Name",
      maxWidth: "25%",
      selector: (row: RowData) => row.english_name,
      sortable: true,
      cell: (row: RowData) => (
        <span
          style={{
            whiteSpace: "unset",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.english_name}
        </span>
      ),
    },
    {
      name: "Original Name",
      maxWidth: "25%",
      selector: (row: RowData) => row.original_name,
      sortable: true,
      cell: (row: RowData) => (
        <span
          style={{
            whiteSpace: "unset",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.original_name}
        </span>
      ),
    },
    {
      name: "Country",
      maxWidth: "10%",
      selector: (row: RowData) => row.country?.name,
      sortable: true,
      cell: (row: RowData) => (
        <span
          style={{
            whiteSpace: "unset",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.country?.name}
        </span>
      ),
    },
    {
      name: "Location",
      maxWidth: "30%",
      selector: (row: RowData) => row.location,
      sortable: true,
      cell: (row: RowData) => (
        <span
          style={{
            whiteSpace: "unset",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.location}
        </span>
      ),
    },
    {
      name: "Action",
      width: "100px",
      cell: (row) => {
        return (
          <Authorize allowedPermission="only_HR">
          <div className="table-icon-box">
            <button
              className="table-icon"
              onClick={() => {
                showEdit(row);
              }}
            >
              <EditOutlined />
            </button>

            <button
              className="table-icon"
              onClick={() => {
                showDelete(row);
              }}
            >
              <DeleteOutlined />
            </button>
          </div>
          </Authorize>
        );
      },
    },
  ];

  const handlePageChange = (page: number) => {
    const search = searchParams.get("search") || "";
    setSearchParams({
      page: page.toString(),
      search,
    });
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
    setSearchParams({
      page: "1",
      search: value,
    });
  };

  return (
    <>
      <div className={styles.container}>
        <Tiles
          texts="University"
          fontSize={25}
          fontWeight={700}
          customClass={styles.listTitle}
        />
        <div className={styles.funcBar}>
        <Authorize allowedPermission="only_HR">
          <Buttons
            texts="Create"
            type="primary"
            status="success"
            icon={<PlusOutlined />}
            handleClick={() => {
              setOpenAdd(true);
            }}
            classNames={styles.createBtn}
          />
             </Authorize>
          <div className={styles.funcBarRight}>
            <div className={styles.searchContainer}>
              <Search
                placeholder="Search"
                onSearch={onSearch}
                enterButton
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Tables
          selectable={true}
          columns={columns}
          currentRecords={currentRecords}
          currentPage={currentPage}
          recordsPerPage={recordsPerPage}
          onPageChange={handlePageChange}
          totalRecords={totalRecords}
        />
        <AddUniversity
          open={openAdd}
          handleCancel={() => setOpenAdd(false)}
          fetchData={fetchUniversity}
          isSelectEmployee={true}
        />
        {editId && (
          <UpdateUniversity
            open={openEdit}
            handleCancel={() => setOpenEdit(false)}
            id={editId}
            fetchData={fetchUniversity}
          />
        )}
        {deleteId && (
          <Deletes
            open={openDelete}
            title="Delete University"
            handleOk={handleDelete}
            handleCancel={() => setOpenDelete(false)}
            type="university"
          />
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default University;
