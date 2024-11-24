import React from "react";
import dayjs from 'dayjs';
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Backs from "../../components/Back/Back";
import Buttons from "../../components/filed/button/button";
import Checkboxes from "../../components/filed/checkbox/CheckBox";
import Inputs from "../../components/filed/inputs/input";
import Selects from "../../components/select/select";
import Tiles from "../../components/titles/Title";
import Dates from "../../components/dates/dates";
import styles from "./createApplicant.module.css";
import {getAll_Job, getUniversity1, createApplicant, getDegree,  getDegreeType,
} from "../../services/axiosApplicant";
import Uploads from "../../components/filed/upload/upload";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { DATE_FORMAT } from '../../schemas/types';
import useLoading from "../../hooks/useLoading";
import TextAreas from "../../components/filed/textArea/TextArea";
import SpaceSelect from "../../components/spaceSelect/spaceSelect";

interface OptionType {
  label: string;
  value: string;
}

interface University {
  id: number;
  english_name: string;
  name:string;
  original_name:string;
}

interface Job {
  id: number;
  name: string;
}

const CreateApplicant: React.FC = () => {
  const navigate = useNavigate();
  const [universityOptions, setUniversityOptions] = React.useState<OptionType[]>([]);
  const [testuniversity, setTestUniversity] = React.useState<OptionType[]>([]);
  const [jobOptions, setJobOptions] = React.useState<OptionType[]>([]);
  const [degreeOptions, setDegreeOptions] = React.useState<OptionType[]>([]);
  const [checkToasst,setCheckToast]=React.useState(false);
  const { setLoading } = useLoading();
  const recordsPerPage = 0;
  const handleBackClick = () => {
    navigate(-1); // Navigate back
  };
  React.useEffect(() => {
    
    const fetchData = async () => {
      const token = localStorage.getItem("token") || "";
      try {
        const [universityResponse, jobResponse, degreeResponse, degreeType] =
          await Promise.all([
            getUniversity1({ headers: { Authorization: `Bearer ${token}` },params:{

              per_page: recordsPerPage,
            }, }),
            getAll_Job(),
            getDegree(),
            getDegreeType(),
          ]);

        // Map API responses to options
        const universities: University[] = universityResponse.data.university;
        const jobs: Job[] = jobResponse.data.all_position_apply;
        const formattedData = degreeType.data.degree_type.reduce((acc, degree) => {
          acc[degree.id] = degree.name;  // Gán `id` làm khóa và `name` làm giá trị
          return acc;
        }, {});
      
        const degrees = formattedData;

        setUniversityOptions(
          universities
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((u) => ({
              name:`${u?.country?.short_name}`,
              label: `${u?.country?.short_name} - ${u?.name}`,
              value: u.id.toString(),
            }))
        );
      //  const unversitys=[
       
      //   ...universities.map((u)=>({
      //     name: `${u?.country_short_name}`,
      //     label:`${u?.name}`,
      //     value:  u.id.toString()
      //   }))
      //  ]
      //  setTestUniversity(unversitys);
        setJobOptions(
          jobs.map((j) => ({ label: j.name, value: j.id.toString() }))
        );
       
        setDegreeOptions(
          Object.keys(degrees).map((key) => ({
            label: degrees[key],
            value: key,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Validation schema for Formik
  const validationSchema = Yup.object({
    fullname: Yup.string().trim().required("Full Name is required"),
    personalEmail: Yup.string().trim().email("Invalid email format").required("Email is required"),
    phoneNumber: Yup.string().trim()
    .matches(/^[0-9]*$/, 'Phone number must contain only digits')
    .required('Phone number is required'),
   
    jobId: Yup.string().required("Position applied is required"),

    cvFile: Yup.mixed().required("CV file is required"), 
    // major: Yup.string().required('Major is required'),
    // degreeId: Yup.string().required('Degree is required'),
    // experience: Yup.string().required('Experience is required'),
    // relevantExp: Yup.string().required('Relevant experience is required'),
    // ranking: Yup.string().required('Ranking is required'),


  });

  const handleSubmit = async (values: any) => {
    setCheckToast(false);
    const channels = {
      avt_web_channel: values.channel.includes("website"),
      facebook_channel: values.channel.includes("Facebook"),
      others_channel: values.channel.includes("Others"),
      friend_channel: values.channel.includes("Friends"),
    };

    // Create FormData object
    const formData = new FormData();
    formData.append("full_name", values.fullname);
    formData.append("email", values.personalEmail);
    formData.append("mobile_number", values.phoneNumber);
    formData.append("position_applied", values.jobId); // Use jobId for position applied
    if (values.cvFile) {
      formData.append("file_cv", values.cvFile);
    }

    formData.append(
      "avt_web_channel",
      channels.avt_web_channel ? "True" : "False"
    );
    formData.append(
      "facebook_channel",
      channels.facebook_channel ? "True" : "False"
    );
    formData.append(
      "others_channel",
      channels.others_channel ? "True" : "False"
    );
    formData.append(
      "friend_channel",
      channels.friend_channel ? "True" : "False"
    );
    // You can uncomment the following lines to include additional fields
    formData.append("university_id", values.universityId);
    formData.append('major', values.major);
    formData.append("degree", values.degreeId);
    formData.append('yearsofexp', values.experience);
    formData.append('relevantexp', values.relevantExp);
    if (values.graduation) {
      formData.append("graduation", dayjs(values.graduation).format(DATE_FORMAT));
    }
    
    formData.append('others_comment', values.otherComment);
    formData.append('remarks', values.remarks);


    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      const response = await createApplicant(formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
     
      toast.success("Applicant added successfully!");
      navigate('/applicant');
      // Điều hướng hoặc thực hiện hành động khác sau khi thành công
    } catch (error) {
      setCheckToast(true);
      if( error?.response?.request?.status===401){
      toast.error(error?.response?.data?.error);
     
      }else{
        toast.error("Create fail!");
      }
      setCheckToast(true);
    }finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        personalEmail: "",
        positionApplied: "",
        phoneNumber: "",
        universityId: "",
        jobId: "",
        major: "",
        degreeId: "",
        experience: "",
        relevantExp: "",
        scoreTest: "",
        cvFile: null,
        channel: [],
        ranking: "",
        fullname: "",
        graduation: "",
        remarks: "",
        otherComment:"",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await handleSubmit(values);
        setSubmitting(false);
      }}
    >
      {(formik) => (
        <Form className={styles.forms}>
          <div className={`${styles.container}`}>
            <Backs types="link" ishowIcon={true} texts="Back" />
            <div className={styles.detailEmployee}>
              <Tiles texts="Create Applicant" fontSize={25} fontWeight={700} />
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
                <Inputs
                  labels="Personal Email"
                  value={formik.values.personalEmail}
                  required
                  id="personalEmail"
                  type="text"
                  name="personalEmail"
                  placeholder="Enter email"
                  onChange={formik.handleChange}
                  errors={
                    formik.errors.personalEmail &&
                    formik.touched.personalEmail &&
                    formik.errors.personalEmail
                  }
                />
                <Inputs
                  labels="Phone Number"
                  value={formik.values.phoneNumber}
                 type="tel"
                  required
                  id="phoneNumber"
                 
                  name="phoneNumber"
                  placeholder="Enter phone"
                  onChange={formik.handleChange}
                  errors={
                    formik.errors.phoneNumber &&
                    formik.touched.phoneNumber &&
                    formik.errors.phoneNumber
                  }
                />
                <div className={styles.item}>
                  <Selects
                    labels="Position Applied: "
                    id="jobId"
                    required
                    options={jobOptions}
                    value={formik.values.jobId}
                    handleChange={(value) =>
                      formik.setFieldValue("jobId", value)
                    }
                    errors={
                      formik.errors.jobId &&
                      formik.touched.jobId &&
                      formik.errors.jobId
                    }

                  />
               
                </div>
                <Uploads
                  labels="Link CV"
                  value={formik.values.cvFile}
                  required
                  id="cvFile"
                  type="file"
                  name="cvFile"
                  onChange={(event) => {
                    const file = event.currentTarget.files
                      ? event.currentTarget.files[0]
                      : null;
                    formik.setFieldValue("cvFile", file);
                  }}
                  errors={
                    formik.errors.cvFile &&
                    formik.touched.cvFile &&
                    formik.errors.cvFile
                  }
                />
                <Checkboxes
                  labels="Channel"
                 
                  check={true}
                  name="channel"
                  value={formik.values.channel}
                  handleChange={formik.setFieldValue}
                  touched={formik.touched.channel}
                  options={[
                    { value: "website", label: "AVTVN Website" },
                    { value: "Facebook", label: "Facebook" },
                    { value: "Friends", label: "Friends" },
                    { value: "Others", label: "Others" },
                  ]}
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
                  errors={formik.errors.universityId}
                />
               {/* <SpaceSelect
               
                  options={testuniversity}
                  value={formik.values.universityId}
                  handleChange={(value) =>
                    formik.setFieldValue( value)
                  }
                /> */}
                

              
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
                <div className={styles.item}>
                  <Selects
                    labels="Degree:"
                    id="degreeId"
                    options={degreeOptions}
                    value={formik.values.degreeId}
                    handleChange={(value) =>
                      formik.setFieldValue("degreeId", value)
                    }
                  />
                  <ErrorMessage
                    name="degreeId"
                    component="div"
                    className={styles.error}
                  />
                </div>
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
                  value={formik.values.graduation}
                  id="graduation"
                  stylecreate
                  name="graduation"
                  onChange={(value) => formik.setFieldValue("graduation", value)}
                />
                <TextAreas
                  labels="Remarks"
                  value={formik.values.remarks}
                  id="remarks"
                  type="text"
                  name="remarks"
                  placeholder="Enter Remarks"
                  onChange={formik.handleChange}
                />
                <TextAreas
                  labels="Other Comment"
                  value={formik.values.otherComment}
                  id="otherComment"
                  type="text"
                  name="otherComment"
                  placeholder="Enter other comment"
                  onChange={formik.handleChange}
                />
              </div>

              <div className={styles.buttons}>
                <Buttons
                  status="success"
                  types="submit"
                  texts="Create"
                  disabled={!formik.isValid || formik.isSubmitting}
                />
                <Buttons
                  status="cancel"
                  texts="Close"
                  handleClick={handleBackClick}
                  className={styles.button}
                />
              </div>
            </div>
          </div>
         {checkToasst &&(
          <ToastContainer />
        
        )} 
        </Form>
        
      )}
      
    </Formik>
  );
};

export default CreateApplicant;