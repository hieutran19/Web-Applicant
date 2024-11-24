import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { message, Input } from "antd";
import styles from "./Applicant.module.css";
import Tables from "../../components/Table/Tables";
import {
  getApplicantOnHolds,
  getAll_Job,
  getStatusList,
} from "../../services/axiosApplicant";
import { ToastContainer } from "react-toastify";
import { convertLinks } from "../../utils/utils";
import Tiles from "../../components/titles/Title";
import useLoading from "../../hooks/useLoading";
import { sortStatusArray } from "../../schemas/sortStatus";
import Selects from "../../components/select/select";
import MenuBar from "../../components/menuBar/MenuBar";
import SelectAPIs from "../../components/select/SelectAPIs";

const { Search } = Input;
interface RowData {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  position_applied: string;
  cv: string;
  status: string;
  university: any;
}

interface Status {
  id: string;
  name: string;
}


interface ApiResponse {
  applicants: RowData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
const menuItem = [
  { key: "False", label: "Active" },
  { key: "True", label: "On Hold" },
];

const ApplicantOnHold = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [currentRecords, setCurrentRecords] = useState<RowData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [onHold, setOnHold] = useState("False");
  const recordsPerPage = 6;
  const [checkLoading, setCheckLoading] = useState<any>();
  const { setLoading } = useLoading();

  const fetchApplicant = async () => {
    setLoading(true);
    const status = searchParams.get("status") || "";
    const position_applied = searchParams.get("position_applied") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";

    const onHold = searchParams.get("onHold") || "False";
    setCurrentPage(page);
    try {
      const params = {
        page,
        per_page: recordsPerPage,
        status,
        position_applied,
        search,
        onHold: onHold,
      };
      const response = await getApplicantOnHolds(params);
      const apiResponse: ApiResponse = response.data;
      setCurrentRecords(apiResponse.applicants);
      setTotalRecords(apiResponse.total);
      const keyOnHold = localStorage.getItem("activeTab") || "False";
      setOnHold(keyOnHold);
    } catch (error) {
      console.log("fetch applicant error", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const statusResponse = await getStatusList();

      const statusArray = [
        ...Object.entries(statusResponse.data).map(([id, name]) => ({
          value: id,
          label: String(name),
        })),
      ];
      sortStatusArray(statusArray);
      setStatusList([{ value: "", label: "All Applicants" }, ...statusArray]);
      // getAll_Jobs
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCheckLoading(false);
    fetchStatus();
    setCheckLoading(true);
  }, []);

  useEffect(() => {
    fetchApplicant();
  }, [searchParams]);

  const columns = [
    {
      name: "Name",
      sortable: false,
      maxWidth: "15%",
      cell: (row: RowData) => (
        <Link
          style={{
            whiteSpace: "unset",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          to={`/applicant/${row.id}`}
        >
          {row.full_name}
        </Link>
      ),
    },
    {
      name: "University",
      maxWidth: "25%",
      selector: (row: RowData) => row?.university?.name || "",
      sortable: false,
      cell: (row: RowData) => {
        return (
          <span
            style={{
              whiteSpace: "unset",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row?.university?.name || ""}
          </span>
        );
      },
    },
    {
      name: "Position Applied",
      maxWidth: "20%",
      selector: (row: RowData) => row.position_applied,
      sortable: false,
      cell: (row: RowData) => {
        return (
          <span
            style={{
              whiteSpace: "unset",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row?.position_applied[0]?.name || ""}
          </span>
        );
      },
    },
    {
      name: "Status",
      maxWidth: "25%",
      selector: (row: RowData) => row.status,
      sortable: false,
      cell: (row: RowData) => {
        return (
          <span
            style={{
              whiteSpace: "unset",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row?.status?.status || ""}
          </span>
        );
      },
    },

    {
      name: "View CV",
      sortable: false,
      maxWidth: "13%",
      cell: (row: RowData) => (
        <a
          href={convertLinks(row.cv)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "var(--color_blue)" }}
        >
          View CV
        </a>
      ),
    },
  ];
  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const status = searchParams.get("status") || "";
    const position_applied = searchParams.get("position_applied") || "";
    const search = searchParams.get("search") || "";
    setSearchParams({
      position_applied,
      status,
      page: page.toString(),
      search
    });
  };
  // Handle status select change
  const handleStatusChange = (value: string) => {
    const position_applied = searchParams.get("position_applied") || "";
    const search = searchParams.get("search") || "";
    setSearchParams({
      position_applied,
      status: value,
      page: "1",
      search
    });
  };
  const handlePositionChange = (value: string) => {
    setSelectedPosition(value);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    setSearchParams({
      position_applied: value,
      status,
      page: "1",
      search,

    });
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
    const status = searchParams.get("status") || "";
    const position_applied = searchParams.get("position_applied") || "";
    setSearchParams({
      position_applied,
      status,
      page: "1",
      search: value
    });
  };
  return (
    <>
      {checkLoading && (
        <div className={styles.container}>
          <Tiles
            texts="Applicant"
            fontSize={25}
            fontWeight={700}
            customClass={styles.listTitle}
          />
          <MenuBar
            defaultItem="1"
            items={menuItem}

          />
          <div className={styles.funcBar}>

            <div className={styles.funcBarRight}>
              <SelectAPIs
                value={selectedPosition}
                show="name"
                required={true}
                handleChange={handlePositionChange}
                optionsAPI={getAll_Job}
                hasAllItem
                allItemLabel="All Positions"
              />
              <Selects
                id="statusSelect"
                labels=""
                required={false}
                options={statusList}
                value={searchParams.get("status") || ""}
                handleChange={handleStatusChange}
                isMultiple={false}
                customClass={styles.selects}
              />
              <div className={styles.searchContainer}>
                <Search placeholder="Search"
                  onSearch={onSearch}
                  enterButton value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)} />
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
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default ApplicantOnHold;
