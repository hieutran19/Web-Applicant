import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import styles from "./SendOffer.module.css";
import Buttons from "../../../../components/filed/button/button";
import Dates from "../../../../components/dates/dates";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Inputs from "../../../../components/filed/inputs/input";
import { DATE_FORMAT } from "../../../../schemas/types";
import Selects from "../../../../components/select/select";
import { typeOfferOptions } from "../../../../schemas/selectData";
import Radios from "../../../../components/filed/Radios/Radios";
import Checkboxes from "../../../../components/filed/checkbox/CheckBox";
import { postOffer } from "../../../../services/AxiosDetailApplicant";
import useLoading from "../../../../hooks/useLoading";
import { getAll_Job } from "../../../../services/axiosApplicant";

interface UpdateProps {
  id: string;
  open: boolean;
  position_applied: any;
  onUpdateSuccess: () => void;
  onUpdateError?: () => void;
  onCancel: () => void;
}

const SendOffer: React.FC<UpdateProps> = ({
  id,
  open,
  position_applied,
  onUpdateSuccess,
  onUpdateError,
  onCancel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobData, setJobData] = useState<any[]>([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    setIsModalOpen(open);

    // Gọi API getAllJob khi modal mở hoặc id thay đổi
    const fetchJobData = async () => {
      try {
        setLoading(true);
        const response = await getAll_Job();

        const formattedJobData = response.data.all_position_apply.map(
          (job: any) => ({
            value: job.id,
            label: job.name, 
          })
        );
        setJobData(formattedJobData);
        const defaultJob = formattedJobData.find(
          (job: any) => job.value == position_applied
        );
        if (defaultJob) {
          formik.setFieldValue("position", defaultJob.label);
        }
      } catch (error) {
        console.error("Failed to fetch job data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && id) {
      fetchJobData();

    }
  }, [open, id, setLoading]);
  const formik = useFormik({
    initialValues: {
      start: dayjs().add(7, 'day').format(DATE_FORMAT),
      end: dayjs().add(6, 'month').subtract(1, 'day').format(DATE_FORMAT),
      type: '1',
      director_name: "",
      position: '',
      director_manager: 'Mr',
      designation: '',
      base_salary: 0,
      allowance: [] as string[], // Khai báo allowance là mảng chuỗi
      acceptance_date: dayjs().add(3, 'day').format(DATE_FORMAT),
      employee_email: '',

    },
    validationSchema: Yup.object({
      position: Yup.string().required('Position is required'),
      end: Yup.string().required("End date is required"),
      type: Yup.string().required('Contract type is required'),
      start: Yup.string().required("Start date is required"),
      director_name: Yup.string().required('Director name is required'),
      designation: Yup.string().required('Designation is required'),
      base_salary: Yup.number().required('Base salary is required').min(0, 'Base salary cannot be less than 0'),

      employee_email: Yup.string().required('Employee Email name is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formattedAcceptanceDate = dayjs(values.acceptance_date, DATE_FORMAT).format('DD/MM/YYYY');
        const payload = {
          id,
          type: values.type,
          position: values.position,
          start: values.start,
          end: values.end,
          director_manager: values.director_manager,
          director_name: values.director_name,
          designation: values.designation,
          base_salary: values.base_salary,
          allowance_lunch: values.allowance.includes('Lunch'),
          allowance_drink: values.allowance.includes('Drink'),
          allowance_parking: values.allowance.includes('Parking'),
          acceptance_date: dayjs(values.acceptance_date, DATE_FORMAT).format(DATE_FORMAT),
          company_email: values.employee_email,
        };

        const token = localStorage.getItem("token") || "";
        await postOffer(payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        onUpdateSuccess();
        toast.success("Offer created successfully");
        setIsModalOpen(false);
      } catch (error) {
        if (onUpdateError) {
          onUpdateError();
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // Update end date when start date changes
  useEffect(() => {
    if (formik.values.start) {
      if (formik.values.type == "1") {
        const startDate = dayjs(formik.values.start, DATE_FORMAT);
        if (startDate.isValid()) {
          const endDateAfterSixMonths = startDate.add(6, "month");
          if (endDateAfterSixMonths.format("DD") < startDate.format("DD")) {
            const newEndDate = startDate.add(6, "month").format(DATE_FORMAT);
            formik.setFieldValue("end", newEndDate);
          } else {
            const newEndDate = startDate
              .add(6, "month")
              .subtract(1, "day")
              .format(DATE_FORMAT);
            formik.setFieldValue("end", newEndDate);
          }
        } else {
          formik.setFieldValue("end", "");
        }
      }
      if (formik.values.type == "2") {
        const startDate = dayjs(formik.values.start, DATE_FORMAT);
        if (startDate.isValid()) {
          const endDateAfterSixMonths = startDate.add(2, "month");
          if (endDateAfterSixMonths.format("DD") < startDate.format("DD")) {
            const newEndDate = startDate.add(6, "month").format(DATE_FORMAT);
            formik.setFieldValue("end", newEndDate);
          } else {
            const newEndDate = startDate
              .add(2, "month")
              .subtract(1, "day")
              .format(DATE_FORMAT);
            formik.setFieldValue("end", newEndDate);
          }
        } else {
          formik.setFieldValue("end", "");
        }
      }

      const newAcceptanceDate = dayjs(
        formik.values.acceptance_date,
        DATE_FORMAT
      );
      formik.setFieldValue("acceptance_date", newAcceptanceDate);
    }
  }, [formik.values.start, formik.values.type]);
  const handleCancel = () => {
    setIsModalOpen(false);
    onCancel();
  };

  return (
    <Modal
      footer={[
        <div className={styles.boxbutton} key="footer-buttons">
          <Buttons texts="Submit" status="success" handleClick={formik.handleSubmit}>
            Submit
          </Buttons>
          <Buttons texts="Cancel" status="cancel" handleClick={handleCancel}>
            Cancel
          </Buttons>
        </div>,
      ]}
      width={800}
      centered
      title="Create Offer"
      open={isModalOpen}
      onCancel={handleCancel}
      className={styles.customModal}
    >
      <div className={styles.formContract}>
        <Selects
          wrap
          labels="Type: "
          id="type" // ID của select
          check={true}
          value={formik.values.type} // Giá trị từ Formik
          required={true}
          options={typeOfferOptions}
          handleChange={(value) => {
            formik.setFieldValue('type', value);
          }}
        />
        <div className={styles.fullWidth}>
          <Inputs
            wrap
            labels="Position"
            id="position" // 
            value={formik.values.position} // Giá trị từ Formik
            required={true}
            onChange={(e) => formik.setFieldValue('position', e.target.value)} // Cập nhật giá trị vào Formik
            errors={formik.errors.position && formik.touched.position && formik.errors.position}
          />
        </div>
        <Dates
          wrap
          labels="Start Date"
          required={true}
          name="start"
          defaultValue={formik.values.start}
          onChange={(date, dateString) => {
            const formattedDate = dayjs(dateString, 'DD/MM/YYYY').format(DATE_FORMAT);
            formik.setFieldValue('start', formattedDate);
          }}
          errors={formik.errors.start && formik.touched.start && formik.errors.start}
        />
        <Dates
          wrap
          labels="End Date"
          required={true}
          name="end"
          defaultValue={formik.values.end}
          onChange={(date, dateString) => {
            formik.setFieldValue('end', dateString);
          }}
          errors={formik.errors.end && formik.touched.end && formik.errors.end}
        />
        <div className={styles.itemFull}>
          <label>Direct Manager</label>
          <div className={styles.itemFullBox}>
            <div className={styles.twoItem}>
              <Radios
                labels="Title"
                wrap
                required={true}
                name="director_manager"
                value={formik.values.director_manager}
                onChange={formik.handleChange}
                touched={formik.touched.director_manager}
                errors={
                  formik.errors.director_manager && formik.touched.director_manager && formik.errors.director_manager
                }
                options={[
                  { value: 'Mr', label: 'Mr.' },
                  { value: 'Ms', label: 'Ms.' }
                ]}
              />
              <Inputs
                wrap
                labels="Name"
                required={true}
                type="text"
                name="director_name"
                placeholder={'Name'}
                value={formik.values.director_name}
                onChange={formik.handleChange}
                touched={formik.touched.director_name}
                errors={formik.errors.director_name && formik.touched.director_name && formik.errors.director_name}
              />
            </div>
            <Inputs
              wrap
              labels="Designation"
              required={true}
              type="text"
              name="designation"
              placeholder={'Name'}
              value={formik.values.designation}
              onChange={formik.handleChange}
              touched={formik.touched.designation}
              errors={formik.errors.designation && formik.touched.designation && formik.errors.designation}
            />
          </div>
        </div>
        <Inputs
          wrap
          labels="Base Salary"
          required={true}
          id="base_salary"
          type="number"
          name="base_salary"
          value={formik.values.base_salary}
          onChange={formik.handleChange}
          touched={formik.touched.base_salary}
          errors={formik.errors.base_salary && formik.touched.base_salary && formik.errors.base_salary}
        />
        <Checkboxes
          labels="Allowances"
          wrap

          name="allowance"
          value={formik.values.allowance} // Ensure this reflects the current state
          handleChange={(name, checkedValues) => {
            formik.setFieldValue(name, checkedValues);
          }}
          touched={formik.touched.allowance}
          errors={formik.errors.allowance && formik.touched.allowance && formik.errors.allowance}
          options={[
            { value: 'Lunch', label: 'Lunch' },
            { value: 'Drink', label: 'Drink' },
            { value: 'Parking', label: 'Parking' }
          ]}
        />


        <Dates
          wrap
          labels="Acceptance Date"
          required={true}
          name="acceptance_date"
          defaultValue={formik.values.acceptance_date}
          onChange={(date, dateString) => {
            formik.setFieldValue("acceptance_date", dateString);
          }}
          errors={
            formik.errors.acceptance_date &&
            formik.touched.acceptance_date &&
            formik.errors.acceptance_date
          }
        />
        <Inputs
          wrap
          labels="Employee Email"
          required={true}
          id="employee_email"
          type="email"
          name="employee_email"
          value={formik.values.employee_email}
          onChange={formik.handleChange}
          touched={formik.touched.employee_email}
          errors={
            formik.errors.employee_email &&
            formik.touched.employee_email &&
            formik.errors.employee_email
          }
        />
      </div>
    </Modal>
  );
};

export default SendOffer;
