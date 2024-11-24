import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { message, Input } from "antd";
import styles from "./Applicant.module.css";
import Links from "../../components/links/Links";
import Tables from "../../components/Table/Tables";
import {
  getApplicants,
  getAll_Job,
  getStatusList,
} from "../../services/axiosApplicant";
import { ToastContainer } from "react-toastify";
import { convertLinks } from "../../utils/utils";
import Tiles from "../../components/titles/Title";
import useLoading from "../../hooks/useLoading";
import Authorize from "../../components/authorize/Authorize";
import { sortStatusArray } from "../../schemas/sortStatus";
import Selects from "../../components/select/select";
import MenuBar from "../../components/menuBar/MenuBar";
import SelectAPIs from "../../components/select/SelectAPIs";
import { dateOptions } from "../../schemas/selectData";
import DateRange from "../../components/dateRange/DateRange";
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

const Applicant = () => {
  const [currentRecords, setCurrentRecords] = useState<RowData[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [statusList, setStatusList] = useState<Status[]>([]);
  const recordsPerPage = 6;
  const { setLoading } = useLoading();
  // Lấy các giá trị từ URL params hoặc đặt giá trị mặc định
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const position_applied = searchParams.get("position_applied") || "";
  const date_range = searchParams.get("date_range") || ""
  const position_applied_label =
    searchParams.get("position_applied_label") || "";
  const onHold = searchParams.get("onHold") || "False";

  const fetchApplicant = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: recordsPerPage,
        status,
        position_applied,
        search,
        date_range: date_range,
        onHold,
      };
      const response = await getApplicants(params);
      const apiResponse: ApiResponse = response.data;
      setCurrentRecords(apiResponse.applicants);
      setTotalRecords(apiResponse.total);
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
    fetchStatus();
  }, []);

  useEffect(() => {
    fetchApplicant();
  }, [searchParams]);

  const columns = [
    {
      name: "Name",
      sortable: true,
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
      sortable: true,
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
      sortable: true,
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
      sortable: true,
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
      sortable: true,
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

  const menuItem = [
    { key: 'My_action', label: "My Action" },
    { key: "False", label: "Active" },
    { key: "True", label: "On Hold" },
  ];

  const handleChangeMenu = (key) => {
    setSearchParams({
      onHold: key,
      page: "1",
    });
    setSearchValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = (searchValue) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      search: searchValue,
      page: "1",
    });
  };
  const handleDateRangeChange = (value) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      date_range: value,
      page: "1",
    });
  };

  const handlePageChange = (page) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: page.toString(),
    });
  };

  return (
    <>
      <div className={styles.container}>
        <Tiles
          texts="Applicant"
          fontSize={25}
          fontWeight={700}
          customClass={styles.listTitle}
        />
        <MenuBar
          defaultItem={onHold}
          items={menuItem}
          onChange={handleChangeMenu}
        />
        <div className={styles.funcBar}>
          <Authorize allowedPermission="update_applicant">
            {onHold == "False" && (
              <Links
                texts="Create"
                icon={<PlusOutlined />}
                to="/applicant/create"
                classNames={styles.createBtn}
              />
            )}
          </Authorize>
          <div className={styles.funcBarRight}>
            <SelectAPIs
              value={parseInt(position_applied, 10) || 0}
              show="name"
              required={true}
              handleChange={(value, object) => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  position_applied: value,
                  position_applied_label: object.label,
                  page: "1",
                });
              }}
              optionsAPI={getAll_Job}
              hasAllItem
              allItemLabel="All Positions"
              defaultValue={
                position_applied && position_applied_label
                  ? {
                    id: parseInt(position_applied, 10) || 0,
                    name: position_applied_label,
                  }
                  : null
              }
            />
            <Selects
              id="statusSelect"
              options={statusList}
              value={searchParams.get("status") || ""}
              handleChange={(value) =>
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  status: value,
                  page: "1",
                })
              }
              isMultiple={false}
              customClass={styles.selects}
            />
            <DateRange handleChange={handleDateRangeChange} />
            <div className={styles.searchContainer}>
              <Search
                placeholder="Search"
                onSearch={handleSearch}
                // allowClear
                enterButton
                value={searchValue}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <Tables
          selectable={true}
          columns={columns}
          currentRecords={currentRecords}
          currentPage={page}
          recordsPerPage={recordsPerPage}
          onPageChange={handlePageChange}
          totalRecords={totalRecords}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default Applicant;
