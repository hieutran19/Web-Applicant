import { useState, useEffect } from "react";
import { DatePicker, TimePicker, Modal } from "antd";
import { Dayjs } from "dayjs";
import dayjs from "dayjs"; // Ensure you import dayjs for time manipulation
import styles from "./Schedule.module.css";
import Buttons from "../../../../components/filed/button/button";
import { toast } from "react-toastify";
import {
  postSchedule,
  get_email_employee,
} from "../../../../services/AxiosDetailApplicant";
import useLoading from "../../../../hooks/useLoading";
import Selects from "../../../../components/select/select";
import axios from "axios";

interface ScheduleProps {
  id: string;
  open: boolean;
  applicant_email: string;
  onUpdateSuccess: () => void;
  onUpdateError?: () => void;
  onCancel: () => void;
  onScheduleSubmit: (data: any) => void;
}

const Schedule: React.FC<ScheduleProps> = ({
  id,
  open,
  onUpdateSuccess,
  onCancel,
  onScheduleSubmit,
  applicant_email,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs()); // Default date is today
  const [selectedTime, setSelectedTime] = useState<
    [Dayjs | null, Dayjs | null] | null
  >([
    dayjs(), // Default start time is now
    dayjs().add(1, "hour"), // Default end time is 1 hour later
  ]);
  const [isDateValid, setIsDateValid] = useState(true);
  const [isTimeValid, setIsTimeValid] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedid, setSelectedid] = useState("");
  const [listEmails, setListEmails] = useState<
    { label: string; value: string; id: string }[]
  >([]);
  const [outsideClickCount, setOutsideClickCount] = useState(0);
  const [isUniversityValid, setIsUniversityValid] = useState(true);
  const { setLoading } = useLoading();
  const [isOAuthTriggered, setIsOAuthTriggered] = useState(false);

  // Vung 23/11/2024
  // Hàm khởi tạo OAuth Flow
  const startOAuth = async () => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_URL_LINKS
        }api/v1/calendar/initiate_authentication`
      );
      setIsOAuthTriggered(true);
      window.open(res.data.authorization_url, "_blank");
    } catch (error) {
      console.log(error);
    }
  };
  // Hàm tạo sự kiện sau khi đã xác thực
  const createEvent = async (data: any) => {
    setLoading(true);
    const token = localStorage.getItem("token") || "";
    const config = {
      headers: {
        Authorization: `Bearer  ${token}`,
      },
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_LINKS}api/v1/calendar/create_event`,
        {
          ...data,
        }
      );
      await postSchedule(data, config);
      onUpdateSuccess();
      setIsModalOpen(false);
      toast.success("Interview scheduled successfully!");
    } catch (error) {
      if (error.response && error.response.status == 401) {
        startOAuth();
      } else {
        console.log(error);
        toast.error("Failed to schedule interview.");
      }
    } finally {
      setLoading(false);
    }
  };
  //----------------------------------------------------------------//

  useEffect(() => {
    setIsModalOpen(open);
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await get_email_employee(config);
        const emailData = response.data.interview_board || [];
        const emailOptions = emailData.map((email: any) => ({
          label: email.work_email,
          value: email.work_email,
          id: email.id,
        }));
        setListEmails(emailOptions);
      } catch (error) {
        console.log("Failed to fetch employee emails:", error);
        toast.error("Failed to fetch employee emails.");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchEmails();
    }
  }, [open]);

  useEffect(() => {
    // Re-submit form when OAuth is completed and tab regains focus
    const handleFocus = () => {
      if (isOAuthTriggered) {
        setIsOAuthTriggered(false); // Reset OAuth trigger state
        handleOk(); // Retry submission
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isOAuthTriggered]);

  const handleOk = async () => {
    let isValid = true;
    if (selectedUniversity.length === 0) {
      setIsUniversityValid(false);
      isValid = false;
    } else {
      setIsUniversityValid(true);
    }
    // Validate Date
    if (!selectedDate) {
      setIsDateValid(false);
      isValid = false;
    } else {
      setIsDateValid(true);
    }
    // Validate Time
    if (!selectedTime || !selectedTime[0] || !selectedTime[1]) {
      setIsTimeValid(false);
      isValid = false;
    } else {
      setIsTimeValid(true);
    }
    if (!isValid) {
      return;
    }
    const updatedEmails = [...selectedUniversity, applicant_email];

    const data = {
      id: Number(id),
      date: selectedDate ? selectedDate.format("DD/MM/YYYY") : null,
      start_time:
        selectedTime && selectedTime[0]
          ? selectedTime[0].format("hh:mm A")
          : null,
      end_time:
        selectedTime && selectedTime[1]
          ? selectedTime[1].format("hh:mm A")
          : null,
      emails: updatedEmails,
      employee: selectedid,
    };
    onScheduleSubmit(data);
    createEvent(data);
  };

  const handleCancel = () => {
    setOutsideClickCount(0);
    setIsModalOpen(false);
    onCancel();
  };
  const handleClickOutside = () => {
    setOutsideClickCount((prev) => prev + 1);
    if (outsideClickCount >= 1) {
      handleCancel();
    }
  };
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleStartTimeChange = (time: Dayjs | null) => {
    if (time) {
      console.log("Start Time:", time.format("hh:mm A"));
      setSelectedTime([time, time.add(1, "hour")]);
    }
  };

  const handleEndTimeChange = (time: Dayjs | null) => {
    if (time) {
      setSelectedTime([selectedTime ? selectedTime[0] : dayjs(), time]);
    }
  };

  const emails = listEmails;

  const handleUniversityChange = (value: string, options: any) => {
    const selectedIds = options.map((opt: any) => Number(opt.key));
    setSelectedid(selectedIds);
    setSelectedUniversity(value);
  };

  return (
    <>
      <Modal
        footer={[
          <div className={styles.boxbutton} key="footer-buttons">
            <Buttons texts="Submit" status="success" handleClick={handleOk}>
              Submit
            </Buttons>
            <Buttons texts="Cancel" status="cancel" handleClick={handleCancel}>
              Cancel
            </Buttons>
          </div>,
        ]}
        centered
        title="Schedule Interview"
        open={isModalOpen}
        closable={false}
        onCancel={handleClickOutside}
        className={styles.customModal}
      >
        <div className={styles.schedule}>
          <div className={styles.schedulecontainer}>
            <div>
              <p className={styles.requiredLabel}>
                Date: <span className={styles.asterisk}>*</span>
              </p>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                className={`${!isDateValid ? styles.invalid : ""}`}
                style={{ width: "100%", height: "38px" }}
              />
              {!isDateValid && (
                <p className={styles.errorText}>Please select a date.</p>
              )}
            </div>

            {/* Time Picker */}
            <div>
              <p className={styles.requiredLabel}>
                Start Time: <span className={styles.asterisk}>*</span>
              </p>
              <TimePicker
                format="hh:mm A"
                value={selectedTime ? selectedTime[0] : null} // Start time
                onChange={handleStartTimeChange}
                className={`${!isTimeValid ? styles.invalid : ""}`}
                style={{ width: "100%", height: "38px" }}
                showNow={false}
                minuteStep={5}
                needConfirm={false}
                use12Hours
              />
              {!isTimeValid && (
                <p className={styles.errorText}>Please select a start time.</p>
              )}
            </div>

            <div>
              <p className={styles.requiredLabel}>
                End Time: <span className={styles.asterisk}>*</span>
              </p>
              <TimePicker
                format="hh:mm A"
                value={selectedTime ? selectedTime[1] : null} // End time
                onChange={handleEndTimeChange}
                className={`${!isTimeValid ? styles.invalid : ""}`}
                style={{ width: "100%", height: "38px" }}
                minuteStep={5}
                showNow={false}
                needConfirm={false}
                use12Hours
              />
              {!isTimeValid && (
                <p className={styles.errorText}>Please select an end time.</p>
              )}
            </div>
          </div>

          <Selects
            required
            isMultiple
            wrap
            check={true}
            labels="Interviewer(s):"
            id="university"
            options={emails}
            value={selectedUniversity}
            handleChange={handleUniversityChange}
            style={{ maxWidth: "calc(100% - 0px)" }}
          />
          {!isUniversityValid && (
            <p className={styles.errorText}>
              Please select at least one guest.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Schedule;
