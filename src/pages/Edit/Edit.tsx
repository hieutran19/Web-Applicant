import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import Backs from "../../components/Back/Back";
import Buttons from "../../components/filed/button/button";
import Checkboxes from "../../components/filed/checkbox/CheckBox";
import Inputs from "../../components/filed/inputs/input";
import Selects from "../../components/select/select";
import Tiles from "../../components/titles/Title";
import styles from "./Edit.module.css";
import {
  getAll_Job,
  getUniversity1,
  getDegree,
  getApplicantDetail,
  updateApplicant,
  getDegreeType,
} from "../../services/axiosApplicant";
import Uploads from "../../components/filed/upload/upload";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useLoading from "../../hooks/useLoading";
import TextAreas from "../../components/filed/textArea/TextArea";
import Dates from "../../components/dates/dates";
import { DATE_FORMAT } from "../../schemas/types";
import { convertLinks } from "../../utils/utils";

interface OptionType {
  label: string;
  value: string;
}
interface Employee {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;
  position_applied: string;
  cv: string;
  major: string;
  remarks: string;
  avt_web_channel: boolean;
  facebook_channel: boolean;
  friend_channel: boolean;
  others_channel: boolean;
  others_comment: string;
  university?: University;
  created_on: string;
  status: string;
  degree: string;
  yearsofexp: string;
  relevantexp: string;
  score_test: any;
  organizations: string;
  graduation: any;
}
interface University {
  id: number;
  english_name: string;
}

interface Job {
  id: number;
  name: string;
}

function Items({ text, label, link, customClass }: any) {
  return (
    <div className={`${styles.itemLabel} ${customClass}`}>
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

const UpdateApplicant: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setLoading } = useLoading();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [universityOptions, setUniversityOptions] = useState<OptionType[]>([]);
  const [jobOptions, setJobOptions] = useState<OptionType[]>([]);
  const [degreeOptions, setDegreeOptions] = useState<OptionType[]>([]);
  const [checkToast, setcheckToast] = useState<boolean>(false);
  const recordsPerPage = 0;
  const handleBackClick = () => {
    navigate(-1); // Navigate back
  };
  useEffect(() => {
    setLoading(true);
    const fetchApplicantData = async () => {
      const token = localStorage.getItem("token") || "";
      try {
        const [applicantDetail, universityResponse, jobResponse, degreeType] =
          await Promise.all([
            getApplicantDetail(Number(id)),
            getUniversity1({
              headers: { Authorization: `Bearer ${token}` },
              params: {
                per_page: recordsPerPage,
              },
            }),
            getAll_Job(),

            getDegreeType(),
          ]);
        if (applicantDetail.data.applicants.length > 0) {
          setEmployee(
            applicantDetail.data.applicants[
              applicantDetail.data.applicants.length - 1
            ]
          );
        } else {
          setEmployee(null);
        }
        const universities = universityResponse.data.university;
        const jobs = jobResponse.data.all_position_apply;

        const formattedData = degreeType.data.degree_type.reduce(
          (acc, degree) => {
            acc[degree.id] = degree.name;
            return acc;
          },
          {}
        );

        const degrees = formattedData;

        setUniversityOptions(
          universities
            .sort((a: University, b: University) =>
              a.name.localeCompare(b.name)
            )
            .map((u: University) => ({
              label: `${u.country?.short_name} - ${u.name}`,
              value: u.id.toString(),
            }))
        );
        setJobOptions(
          jobs.map((j: Job) => ({ label: j.name, value: j.id.toString() }))
        );
        setDegreeOptions(
          Object.keys(degrees).map((key) => ({
            label: degrees[key],
            value: key,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantData();
  }, [id]);

  // Validation schema for Formik
  const validationSchema = Yup.object({
    fullname: Yup.string().required("Full Name is required"),
    personalEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),

    // cvFile: Yup.mixed().required("CV file is required"),
  });

  const handleSubmit = async (values: any) => {
    // const channels = {
    //   avt_web_channel: values.channel.includes("website"),
    //   facebook_channel: values.channel.includes("Facebook"),
    //   friend_channel: values.channel.includes("friend"),
    //   others_channel: values.channel.includes("Others"),
    // };

    const formData = new FormData();
    formData.append("full_name", values.fullname);
    // formData.append("email", values.personalEmail);
    // formData.append("mobile_number", values.phoneNumber);

    // if (values.cvFile) {
    //   formData.append("cv", values.cvFile);
    // }

    // formData.append(
    //   "avt_web_channel",
    //   channels.avt_web_channel ? "True" : "False"
    // );
    // formData.append(
    //   "facebook_channel",
    //   channels.facebook_channel ? "True" : "False"
    // );
    // formData.append(
    //   "friend_channel",
    //   channels.friend_channel ? "True" : "False"
    // );
    // formData.append(
    //   "others_channel",
    //   channels.others_channel ? "True" : "False"
    // );
    formData.append("university_id", values.universityId);
    formData.append("major", values.major);
    formData.append("degree", values.degreeId);
    formData.append("yearsofexp", values.experience);
    formData.append("relevantexp", values.relevantExp);
    formData.append("other_comment", values.other_comment);
    // formData.append("remarks", values.remarks);
    formData.append("score_test", values.score_test);
    if (values.graduation !== employee.graduation) {
      formData.append(
        "graduation",
        dayjs(values.graduation).format(DATE_FORMAT)
      );
    }
    try {
      setLoading(true);
      setcheckToast(false);
      const token = localStorage.getItem("token") || "";

      await updateApplicant(id, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Applicant updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating applicant:", error);
      setcheckToast(true);
      toast.error("You have applied for this position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          personalEmail: employee?.email || "",
          phoneNumber: employee?.mobile_number || "",
          universityId: employee?.university?.id.toString() || "",
          jobId: employee?.position_applied[0].name || "",
          major: employee?.major || "",
          degreeId: employee?.degree?.id || "",
          experience: employee?.yearsofexp || "",
          relevantExp: employee?.relevantexp || "",
          cvFile: employee?.cv || null,
          score_test:
            employee?.score_test === -1 ? "" : employee?.score_test || "",

          channel: [
            employee?.avt_web_channel ? "website" : "",
            employee?.facebook_channel ? "Facebook" : "",
            employee?.friend_channel ? "friend" : "",
            employee?.others_channel ? "Others" : "",
          ].filter(Boolean), // Only add channels that are true
          fullname: employee?.full_name || "",
          remarks: employee?.remarks || "",
          other_comment: employee?.others_comment || "",
          graduation: employee?.graduation || "",
          // created_on: employee?.created_on || "",
          created_on: dayjs(employee?.created_on).format("DD/MM/YYYY"),
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className={styles.forms}>
            <div className={`${styles.container}`}>
              <Backs types="link" ishowIcon={true} texts="Back" />
              <div className={styles.detailEmployee}>
                <Tiles
                  texts={`${formik.values.fullname}: Update `}
                  fontSize={25}
                  fontWeight={700}
                />
                <div className={`${styles.basic} ${styles.information}`}>
                  <Tiles
                    texts="Applicant Information"
                    fontSize={22}
                    fontWeight={500}
                    customClass={styles.titles}
                  />

                  <Inputs
                    labels="Full Name"
                    value={formik.values.fullname}
                    required
                    id="fullname"
                    type="text"
                    name="fullname"
                    placeholder="Enter Name"
                    onChange={formik.handleChange}
                    errors={
                      formik.errors.fullname &&
                      formik.touched.fullname &&
                      formik.errors.fullname
                    }
                  />
                  <Items label="Personal Email:" text={employee?.email} />
                  <Items label="Phone Number:" text={employee?.mobile_number} />
                  <Items
                    label="Position Applied:"
                    text={employee?.position_applied[0]?.name}
                  />
                  <Items
                    label="Link CV:"
                    text="View CV"
                    link={convertLinks(employee?.cv)}
                  />

                  {/* <Dates
                    disabled
                    labels="Created On"
                    value={
                      formik.values.created_on
                        ? dayjs(formik.values.created_on).format("DD/MM/YYYY")
                        : "dd/mm/yyyy"
                    }
                    id="created_on"
                    stylecreate
                    name="created_on"
                    defaultValue={formik.values.created_on}
                    onChange={(value) =>
                      formik.setFieldValue("created_on", value)
                    }
                    show="date"
                  /> */}
                  {/* <Checkboxes
                    disabled
                    labels="Channel"
                    name="channel"
                    value={formik.values.channel}
                    handleChange={formik.setFieldValue}
                    check={true}
                    options={[
                      { value: "website", label: "AVTVN Website" },
                      { value: "Facebook", label: "Facebook" },
                      { value: "friend", label: "Friend" },
                      { value: "Others", label: "Others" },
                    ]}
                  /> */}

                  <Items
                    label="Channel:"
                    text={`${employee?.avt_web_channel ? "AVT Web, " : ""}
          ${employee?.facebook_channel ? "Facebook, " : ""}
          ${employee?.friend_channel ? "Friend, " : ""}
          ${employee?.others_channel ? "Others, " : ""}`
                      .trim()
                      .replace(/,\s*$/, "")}
                  />
                  <Items
                    customClass={styles.itemFull}
                    label="Remark:"
                    text={employee?.remarks}
                  />
                </div>

                <div className={`${styles.basic} ${styles.information}`}>
                  <Tiles
                    texts="Education and Experience Information"
                    fontSize={22}
                    fontWeight={500}
                    customClass={styles.titles}
                  />

                  <Selects
                    istooltip={true}
                    labels="University:"
                    id="universityId"
                    options={universityOptions}
                    value={formik.values.universityId}
                    handleChange={(value) =>
                      formik.setFieldValue("universityId", value)
                    }
                    customClass={styles.select}
                    errors={formik.errors.universityId}
                  />
                  <Inputs
                    labels="Major"
                    value={formik.values.major}
                    id="major"
                    type="text"
                    name="major"
                    placeholder="Enter Major"
                    onChange={formik.handleChange}
                    errors={
                      formik.errors.major &&
                      formik.touched.major &&
                      formik.errors.major
                    }
                  />

                  <Selects
                    labels="Degree:"
                    id="degreeId"
                    options={degreeOptions}
                    value={formik.values.degreeId}
                    handleChange={(value) =>
                      formik.setFieldValue("degreeId", value)
                    }
                    customClass={styles.select}
                    errors={formik.errors.universityId}
                  />
                  <ErrorMessage
                    name="degreeId"
                    component="div"
                    className={styles.error}
                  />

                  <Inputs
                    labels="Experience"
                    value={formik.values.experience}
                    id="experience"
                    type="text"
                    name="experience"
                    placeholder="Enter Experience"
                    onChange={formik.handleChange}
                    errors={
                      formik.errors.experience &&
                      formik.touched.experience &&
                      formik.errors.experience
                    }
                  />
                  <Inputs
                    labels="Relevant Experience"
                    value={formik.values.relevantExp}
                    id="relevantExp"
                    type="text"
                    name="relevantExp"
                    placeholder="Enter Relevant Experience"
                    onChange={formik.handleChange}
                    errors={
                      formik.errors.relevantExp &&
                      formik.touched.relevantExp &&
                      formik.errors.relevantExp
                    }
                  />
                  <Dates
                    labels="Graduation Date"
                    value={
                      formik.values.graduation
                        ? dayjs(formik.values.graduation).format(DATE_FORMAT)
                        : "20/2/2024"
                    }
                    id="graduation"
                    stylecreate
                    name="graduation"
                    defaultValue={formik.values.graduation}
                    onChange={(value) =>
                      formik.setFieldValue("graduation", value)
                    }
                    show="date"
                  />

                  <Inputs
                    labels="Score Test"
                    value={formik.values.score_test}
                    id="score_test"
                    type="text"
                    name="score_test"
                    placeholder="Enter score test"
                    onChange={formik.handleChange}
                    customClass={styles.inputs}
                  />
                  <TextAreas
                    labels="Other Comment"
                    value={formik.values.other_comment}
                    id="other_comment"
                    type="text"
                    name="other_comment"
                    placeholder="Enter other comment"
                    onChange={formik.handleChange}
                  />
                </div>

                <div className={styles.buttons}>
                  <Buttons
                    status="success"
                    types="submit"
                    texts="Save"
                    disabled={!formik.isValid || formik.isSubmitting}
                  />
                  <Buttons
                    status="cancel"
                    texts="Cancel"
                    handleClick={handleBackClick}
                    className={styles.button}
                  />
                </div>
              </div>
            </div>
            {checkToast && <ToastContainer />}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UpdateApplicant;
