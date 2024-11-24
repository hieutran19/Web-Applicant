import { Form, Formik } from "formik";
import { userLogin } from "../../services/apiUser";
import { toast } from "react-toastify";
import styles from "./Login.module.css";
import useAuth from "../../hooks/useAuth";
import Inputs from "../../components/filed/inputs/input";
import Buttons from "../../components/filed/button/button";
import OauthBtn from "../LoginCallback/Oauth";

export default function Login() {
  const { login } = useAuth();

  const initialValues = {
    username: "",
    password: "",
  };

  const onSubmit = async (values, actions) => {
    try {
      const res = await userLogin(values);
      login(res?.data?.token, res?.data?.refresh_token, true);
    } catch (error) {
      toast.error("Login error");
    } finally {
      actions.setSubmitting(false); // End form submission state
    }
  };

  const isLocalhost = window.location.hostname === "localhost";

  return (
    <div className={styles.loginWrapper}>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form className={styles.forms}>
              <div className={styles.formHeading}>
                <h2>Sign In</h2>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.imgBox}>
                  <img src="/images/SignIn.png" alt="sign in" />
                </div>
                <div className={styles.formBox}>
                  {isLocalhost && (
                    <>
                      <Inputs
                        customClass={styles.loginInput}
                        wrap
                        labels="Username"
                        required={true}
                        type="text"
                        name="username"
                        placeholder={"Username"}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        touched={formik.touched.username}
                        errors={
                          formik.errors.username &&
                          formik.touched.username &&
                          formik.errors.username
                        }
                      />

                      <Inputs
                        wrap
                        customClass={styles.loginInput}
                        labels="Password"
                        required={true}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        touched={formik.touched.password}
                        errors={
                          formik.errors.password &&
                          formik.touched.password &&
                          formik.errors.password
                        }
                      />
                    </>
                  )}
                  <div className={styles.buttonBox}>
                    {isLocalhost && (
                      <Buttons texts="Login" types="submit" status="success" />
                    )}
                    <OauthBtn />
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}


// import { Form, Formik, useFormik } from 'formik';
// import { userLogin } from '../../services/apiUser';
// import { toast } from 'react-toastify';
// import styles from './Login.module.css';
// import useAuth from '../../hooks/useAuth';
// import Inputs from '../../components/filed/inputs/input';
// import Buttons from '../../components/filed/button/button';
// import OauthBtn from '../LoginCallback/Oauth';

// export default function Login() {
//   const { login } = useAuth();

//   const initialValues = {
//     username: '',
//     password: ''
//   };

//   const onSubmit = async (values, actions) => {
//     try {
//       const res = await userLogin(values);
//       login(res?.data?.token, res?.data?.refresh_token, true);
//     } catch (error) {
//       toast.error('Login error');
//     } finally {
//     }
//   };

//   return (
//     <div className={styles.loginWrapper}>
//       <Formik
//         enableReinitialize={true}
//         initialValues={initialValues || {}}
//         // validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {(formik) => {
//           return (
//             <Form className={styles.forms}>
//               <div className={styles.formHeading}>
//                 <h2>Sign In</h2>
//               </div>
//               <div className={styles.contentBox}>
//                 <div className={styles.imgBox}>
//                   <img src="/images/SignIn.png" alt="sign in" />
//                 </div>
//                 <div className={styles.formBox}>
//                   <Inputs
//                     customClass={styles.loginInput}
//                     wrap
//                     labels="Username"
//                     required={true}
//                     type="text"
//                     name="username"
//                     placeholder={'Username'}
//                     value={formik.values.username}
//                     onChange={formik.handleChange}
//                     touched={formik.touched.username}
//                     errors={formik.errors.username && formik.touched.username && formik.errors.username}
//                   />
//                   <Inputs
//                     wrap
//                     customClass={styles.loginInput}
//                     labels="Password"
//                     required={true}
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={formik.values.password}
//                     onChange={formik.handleChange}
//                     touched={formik.touched.password}
//                     errors={formik.errors.password && formik.touched.password && formik.errors.password}
//                   />
//               <div className={styles.buttonBox}>
//               <Buttons texts="Login" types="submit" status="success" />
//                 <OauthBtn />
               
//                 {/* <Buttons
//                   texts="Cancel"
//                   status="cancel"
//                   handleClick={() => {
//                     navigate(-1);
//                   }}
//                 /> */}
//               </div>
//                 </div>
//               </div>
//             </Form>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// }
