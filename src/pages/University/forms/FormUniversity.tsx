import styles from "./formUniversity.module.css";
import Inputs from "../../../components/filed/inputs/input";
import { getAllCountry } from "../../../services/axiosApplicant";
import SelectAPI from "../../../components/select/SelectAPI";

export default function FormUniversity(props: any) {
  const { formik, university } = props;

  return (
    <div className={styles.formEducation}>
      <Inputs
        wrap
        labels="Name"
        required={true}
        type="text"
        name="name"
        placeholder={"Name"}
        value={formik.values.name}
        onChange={formik.handleChange}
        touched={formik.touched.name}
        errors={formik.errors.name}
      />
      <Inputs
        wrap
        labels="English Name"
        required={true}
        type="text"
        name="english_name"
        placeholder={"English Name"}
        value={formik.values.english_name}
        onChange={formik.handleChange}
        touched={formik.touched.english_name}
        errors={formik.errors.english_name}
      />
      <Inputs
        wrap
        labels="Original Name"
        required={true}
        type="text"
        name="original_name"
        placeholder={"Origin Name"}
        value={formik.values.original_name}
        onChange={formik.handleChange}
        touched={formik.touched.original_name}
        errors={formik.errors.original_name}
      />
      <SelectAPI
        wrap
        labels="Country"
        name="country"
        defaultValue={university?.country}
        value={formik?.values?.country}
        customerClass={styles.selectApi}
        required={true}
        show="name"
        handleChange={(value) => {
          formik.setFieldValue("country", value);
        }}
        optionsAPI={getAllCountry}
        setDefaultValue={(defaultValue) =>
          formik.setFieldValue("country", defaultValue)
        }
      />

      <Inputs
        wrap
        labels="Location"
        required={true}
        type="text"
        name="location"
        placeholder={"Location"}
        value={formik.values.location}
        onChange={formik.handleChange}
        touched={formik.touched.location}
        errors={formik.errors.location}
      />
      <Inputs
        wrap
        labels="Ranking"
        type="number"
        name="ranking"
        value={formik.values.ranking}
        onChange={formik.handleChange}
        touched={formik.touched.ranking}
        errors={formik.errors.ranking}
      />
    </div>
  );
}
