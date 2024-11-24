import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import RequireAuth from "./RequiredAuth";
import DetailApplicant from "../pages/DetailApplicant/DetailApplicant";
import MainLayout from "../MainLayout";
import AuthCallback from "../pages/LoginCallback/Callback";
import Applicant from "../pages/Applicant/Applicant";
import CreateApplicant from "../pages/CreateApplicant/createApplicant";
import UpdateApplicant from "../pages/Edit/Edit";
import Authorize from "../components/authorize/Authorize";
import Unauthorized from "../pages/Unknown/Unauthorized";
import NotFound from "../pages/Unknown/NotFound";
import GoogleCallback from "../pages/LoginCallback/GoogleCallback";
import ApplicantOnHold from "../pages/Applicant/ApplicantOnHold";
import University from "../pages/University/University";
import { UniversityDetail } from "../pages/University/detail/UniversityDetail";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<AuthCallback />} />
      <Route path="/google/callback" element={<GoogleCallback />} />
      <Route path="/" element={<MainLayout />}>
        {/* ----------------NotFound------------ */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
        {/* <Route path="*" element={<NotFound />} /> */}
        {/* ----------------home------------ */}
        <Route element={<RequireAuth />}>
          <Route>
            <Route path="/" element={<Home />} />
          </Route>

          {/* ------------- Applicant ------------- */}
          <Route
            path="/applicant/update/:id"
            element={
              <Authorize allowedPermission="update_applicant" isRouter>
                <UpdateApplicant />
              </Authorize>
            }
          />

          <Route
            path="/applicant/:id"
            element={
              <Authorize allowedPermission="detail_applicant" isRouter>
                <DetailApplicant />
              </Authorize>
            }
          />

          {/*Create*/}
          <Route
            path="/applicant/create"
            element={
              <Authorize allowedPermission="create_applicant" isRouter>
                <CreateApplicant />
              </Authorize>
            }
          />
          {/*ApplicantList*/}
          <Route
            path="/applicant"
            element={
              <Authorize allowedPermission="read_applicant" isRouter>
                <Applicant />
              </Authorize>
            }
          />
          <Route
            path="/applicant/on_hold"
            element={
              <Authorize allowedPermission="read_applicant" isRouter>
                <ApplicantOnHold />
              </Authorize>
            }
          />
          <Route path="/university"
            element={
              <Authorize allowedPermission="only_HR" isRouter>
                < University/>
              </Authorize>
            }/>
          <Route path="/university/:id"
            element={
              <Authorize allowedPermission="read_applicant" isRouter>
                < UniversityDetail/>
              </Authorize>
            }/>

        
        </Route>
      </Route>
    </Routes>
  );
}
