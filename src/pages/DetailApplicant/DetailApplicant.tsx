import { useParams } from "react-router-dom";
import Backs from "../../components/Back/Back";
import { useState, useEffect } from "react";
import { getApplicantDetail } from "../../services/axiosApplicant";
import { getAuditHistory } from "../../services/AxiosDetailApplicant";
import styles from "./DetailApplicant.module.css";
import Tiles from "../../components/titles/Title";
import Event from "./events/EventDetail";
import { convertLinks } from "../../utils/utils";
import Tables from "../../components/Table/Tables";
import { parse, format, isValid } from "date-fns";
import useLoading from "../../hooks/useLoading";
import OfferInfor from "./offerInformation/Offerinfor";
interface University {
  english_name?: string;
  original_name?: string;
  name?: string;
}
interface Employee {
  id?: number;
  full_name?: string;
  email?: string;
  mobile_number?: string;
  position_applied?: string;
  cv?: string;
  major?: string;
  avt_web_channel?: boolean;
  facebook_channel?: boolean;
  friend_channel?: boolean;
  others_channel?: boolean;
  others_comment: string;
  university?: University;
  created_on?: string;
  status?: string;
  degree?: string;
  yearsofexp?: string;
  relevantexp?: string;
  score_test?: any;
  organizations?: string;
  comment?: string;
  remarks?: string;
  graduation?: any;
  is_on_hold?: boolean;
}

interface ItemsProps {
  label?: string;
  text?: string;
  link?: string;
}

interface RowData {
  id: number;
  time: string;
  user: string;
  action: string;
  comment: string;
  previous: string;
  current: string;
}

function Items({ text, label, link }: ItemsProps) {
  return (
    <div className={styles.item}>
      <label className={styles.boldLabel}>{label}</label>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
}

const DetailApplicant = () => {
  const { setLoading } = useLoading();
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [currentRecords, setCurrentRecords] = useState<RowData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkUser, setCheckUser] = useState<{ user: string }>({ user: "" });

  const recordsPerPage = 5;

  const fetchAllData = async () => {
    setLoading(true);

    try {
      // Fetch applicant detail
      const applicantRes = await getApplicantDetail(Number(id));
      const lengthApp = applicantRes.data.applicants.length;
      if (applicantRes.data.applicants.length > 0) {
        setEmployee(applicantRes?.data?.applicants[lengthApp - 1]);
      } else {
        setEmployee(null);
      }

      // Fetch audit history
      const auditRes = await getAuditHistory(Number(id));
      const auditData = auditRes.data.audit_history.map(
        (record: any, index: number) => ({
          id: `${record.applicant_id}-${index}`,
          time: format(
            parse(record.timestamp, "dd/MM/yyyy HH:mm", new Date()),
            "HH:mm dd/MM/yyyy"
          ),
          user: record.user,
          action: record.action,
          previous: record.previous_status,
          comment: record.comment,
          current: record.current_status,
        })
      );
      setCurrentRecords(auditData);
      let latestFail = null;
      for (const record of auditData) {
        if (record.action === "Fail") {
          latestFail = record;
          break;
        }
      }
            setCheckUser({ user: latestFail.user });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const handleUpdateSuccess = () => {
    fetchAllData();
  };

  const isValidDate = (date: string): boolean => {
    const parsedDate = new Date(date);
    return isValid(parsedDate);
  };

  const formattedDate = isValidDate(employee?.created_on)
    ? format(new Date(employee?.created_on), "dd/MM/yyyy")
    : "Ngày không hợp lệ";

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecordsToDisplay = currentRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const columns = [
    {
      name: "Time",
      width: "15%",
      selector: (row: { time: string }) => row.time,
      fixed: "left",
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
            {row?.time || ""}
          </span>
        );
      },
    },
    {
      name: "User",
      width: "10%",
      selector: (row: { user: string }) => row.user,
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
            {row?.user || ""}
          </span>
        );
      },
    },
    {
      name: "Action",
      width: "15%",
      selector: (row: { action: string }) => row.action,
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
            {row?.action || ""}
          </span>
        );
      },
    },

    {
      name: "Previous Status",
      width: "20%",
      selector: (row: { previous: string }) => row.previous,
      sortable: true,
      cell: (row: { previous: string }) => (
        <div
          style={{
            whiteSpace: "unset",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.previous}
        </div>
      ),
    },
    {
      name: "Current Status",
      width: "20%",
      selector: (row: { current: string }) => (
        <div
          style={{
            whiteSpace: "break-spaces",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.current}
        </div>
      ),
    },
    {
      name: "Comment",
      width: "20%",
      selector: (row: { comment: string }) => (
        <div
          style={{
            whiteSpace: "break-spaces",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.comment}
        </div>
      ),
      sortable: true,
    },
  ];

  return (
    <div className={styles.container}>
      <Backs types="link" ishowIcon={true} texts="Back" />
      <div className={styles.detailEmployee}>
        <Tiles texts={employee?.full_name} fontSize={25} fontWeight={700} />
        <div className={`${styles.basic} ${styles.information}`}>
          <Tiles
            texts="Applicant Information"
            fontSize={22}
            fontWeight={500}
            customClass={styles.titles}
          />
          <Items label="Email:" text={employee?.email} />
          <Items label="Phone:" text={employee?.mobile_number} />
          <Items
            label="Position Applied:"
            text={employee?.position_applied[0]?.name}
          />
          <Items
            label="Link CV:"
            text="View CV"
            link={convertLinks(employee?.cv)}
          />
          <Items label="Status:" text={employee?.status?.status} />
          <Items label="Created On:" text={formattedDate} />

          <Items
            label="Channel:"
            text={`${employee?.avt_web_channel ? "AVT Web, " : ""}
          ${employee?.facebook_channel ? "Facebook, " : ""}
          ${employee?.friend_channel ? "Friend, " : ""}
          ${employee?.others_channel ? "Others, " : ""}`
              .trim()
              .replace(/,\s*$/, "")}
          />
          <Items label="Remark:" text={employee?.remarks} />
        </div>
      </div>

      <div className={`${styles.basic} ${styles.information}`}>
        <Tiles
          texts="Education and Experience Information"
          fontSize={22}
          fontWeight={500}
          customClass={styles.titles}
        />
        <Items label="University:" text={employee?.university?.name || ""} />
        <Items label="Major:" text={employee?.major || ""} />
        <Items
          label="Degree:"
          text={employee?.degree_type?.name || employee?.degree?.degree || ""}
        />
        <Items label="Experience:" text={employee?.yearsofexp} />
        <Items label="Related Experience:" text={employee?.relevantexp} />
        <Items label="Graduation Date:" text={employee?.graduation} />
        <Items label="Other Comment:" text={employee?.others_comment} />
        <Items
          label="Score Test:"
          text={employee?.score_test === -1 ? "" : employee?.score_test}
        />
      </div>

      <OfferInfor id={id} />

      <div className={styles.basic}>
        <Tiles
          texts="Audit History"
          fontSize={22}
          fontWeight={500}
          customClass={styles.titles}
        />
        <Tables
          selectable={false}
          columns={columns}
          currentRecords={currentRecordsToDisplay} // Use the sliced records
          currentPage={currentPage}
          recordsPerPage={recordsPerPage}
          totalRecords={currentRecords.length} // Pass the total records count
          onPageChange={setCurrentPage} // Handle page changes
        />
      </div>

      <Event
        status={employee?.status?.id}
        onUpdateSuccess={handleUpdateSuccess}
        checkUsers={checkUser}
        applicant_email={employee?.email}
        position_applied={employee?.position_applied[0]?.id}
        checkOnHold={employee?.is_on_hold}
      />
    </div>
  );
};

export default DetailApplicant;
