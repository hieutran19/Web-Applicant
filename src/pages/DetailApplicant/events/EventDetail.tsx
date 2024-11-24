import Buttons from "../../../components/filed/button/button";
import styles from "./EvenDetail.module.css";
import Pass from "./pass/pass";
import AcceptOffer from "./acceptOffer/acceptOffer";
import Approval from "./ApprovalOffer/ApprovalOffer";
import False from "./false/false";
import Return from "./Return/return";
import Schedule from "./Shedule/Schedule";
import RejectOffer from "./ApprovalOffer/rejectOffer";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WithDraw from "./Withdraw/Withdraw";
import RejectCandidate from "./rejectCandidate/rejectCandidate";
import SendOffer from "./SendOffer/SendOffer";
import DeclineOffer from "./DeclineOffer/declineoffer";
import Links from "../../../components/links/Links";
import Authorize from "../../../components/authorize/Authorize";
import PassReject from "./pass/passReject";
import Onhold from "./onHold/onHold";
import Remark from "./AddRemark/Remark";
interface EventDetailProps {
  status: string;
  checkUsers?: string;
  applicant_email?: string;
  position_applied?: string;
  checkOnHold?: any;
  onUpdateSuccess: () => void;
}

const Event: React.FC<EventDetailProps> = ({
  status,
  onUpdateSuccess,
  checkUsers,
  applicant_email,
  position_applied,
  checkOnHold,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSendOfferModalOpen, setIsSendOfferModalOpen] = useState(false);
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const handleBackClick = () => {
    navigate(-1); // Navigate back
  };

  const handleSchedukeClick = () => {
    setIsScheduleModalOpen(true);
  };
  const handleModalScheduleClose = () => {
    setIsScheduleModalOpen(false);
  };
  const showSchuduleErrorToast = () => {
    toast.error("Schedule error!");
  };
  // WithDraw
  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true);
  };
  const handleModalWithdrawClose = () => {
    setIsWithdrawModalOpen(false);
  };
  const showWithdrawErrorToast = () => {
    toast.error("Withdraw error!");
  };
  // Send Offer
  const handleSendOfferClick = () => {
    setIsSendOfferModalOpen(true);
  };
  const handleModalSendOfferClose = () => {
    setIsSendOfferModalOpen(false);
  };
  const showSendOfferErrorToast = () => {
    toast.error("Send Offer error!");
  };
  return (
    <div className={styles.event}>
      {!checkOnHold && (
        <>
          {status === "1" && (
            <>
              <Authorize allowedPermission="Pending_CV_Scanning">
                <Links texts="Update" to={`/applicant/update/${id}`}></Links>
                <Pass
                  onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                />

                <Onhold
                  onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                  checkOnHold={checkOnHold}
                />
                <False
                  onUpdateSuccess={onUpdateSuccess}
                  id={id || ""}
                  status={status}
                />
              </Authorize>
            </>
          )}

          {status === "3" && (
            <>
              <Authorize allowedPermission="Pending_Interview_Board">
                <Pass
                  onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                />
                <Onhold
                  onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                  checkOnHold={checkOnHold}
                />
                <False
                  onUpdateSuccess={onUpdateSuccess}
                  id={id || ""}
                  status={status}
                />
                <Return
                  onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                />
              </Authorize>
            </>
          )}
          {status === "4" && (
            <>
              <Authorize allowedPermission="Pending_Interview_Scheduling">
                <Buttons
                  handleClick={handleSchedukeClick}
                  status="success"
                  texts="Schedule Interview"
                />
                {/* <Onhold  onUpdateSuccess={onUpdateSuccess}
              status={status}
              id={id || ""}
              checkOnHold={checkOnHold}/> */}
                <Buttons
                  handleClick={handleWithdrawClick}
                  status="danger"
                  texts="Withdraw"
                />
              </Authorize>
            </>
          )}
          {status === "5" && (
            <>
              <Authorize allowedPermission="Pending_Interview">


              </Authorize>
              <Authorize allowedPermission="Withdraw_Pending_Interview">
                <Buttons
                  handleClick={handleWithdrawClick}
                  status="danger"
                  texts="Withdraw"
                />
              </Authorize>
            </>
          )}
          {status === "6" && (
            <>
              <Authorize allowedPermission="Pending_Offer">
                <Buttons
                  handleClick={handleSendOfferClick}
                  status="success"
                  texts="Send Offer"
                />
                <Authorize allowedPermission="Withdraw_Button">
                </Authorize>
              </Authorize>
            </>
          )}
          {status === "8" && (
            <>
              <Authorize allowedPermission="Pending_Acceptance">
                <AcceptOffer
                  onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                />
                <DeclineOffer
                  onUpdateSuccess={onUpdateSuccess}
                  id={id || ""}
                  status={status}
                />
                <Buttons
                  handleClick={handleWithdrawClick}
                  status="danger"
                  texts="Withdraw"
                />
              </Authorize>
            </>
          )}
          {status === "9" && (
            <>
              <Authorize allowedPermission="Onboarding">
                <Buttons
                  handleClick={handleWithdrawClick}
                  status="danger"
                  texts="Withdraw"
                />
              </Authorize>
            </>
          )}
          {status === "11" && (
            <>
              <Authorize allowedPermission="Pending Rejection Approval">
                <Links texts="Update" to={`/applicant/update/${id}`}></Links>
                {checkUsers?.user !== parsedUser?.username && (
                  <>
                  <PassReject
                    onUpdateSuccess={onUpdateSuccess}
                    status={status}
                    id={id || ""}
                  
                  />
                  <RejectCandidate
                  onUpdateSuccess={onUpdateSuccess}
                  id={id || ""}
                  status={status}
                  
                />
                </>
                )}
                  
                  
                {/* )} */}
              </Authorize>
            </>
          )}

          {status === "15" && (
            <>
              <Authorize allowedPermission="Pending_Offer_Approval">
                <Approval
                  onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                />
                <Onhold onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                  checkOnHold={checkOnHold} />
                <RejectOffer
                  onUpdateSuccess={onUpdateSuccess}
                  id={id || ""}
                  status={status}
                />
              </Authorize>
            </>
          )}
          {status === "16" && (
            <>
              <Authorize allowedPermission="Pending_Interview_Results">
                <Pass
                  onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                />
                 </Authorize>
                 <Authorize allowedPermission="Pending_Interview_Results">
                <Remark   onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}/>
                    </Authorize>
                    <Authorize allowedPermission="Pending_Interview_Results_Onhold">
                 <Onhold onUpdateSuccess={onUpdateSuccess}
                  status={status}
                  id={id || ""}
                  checkOnHold={checkOnHold} />
                  </Authorize>
                   <Authorize allowedPermission="Pending_Interview_Results">
                <False
                  onUpdateSuccess={onUpdateSuccess}
                  id={id || ""}
                  status={status}
                />
                </Authorize>
          
              <Authorize allowedPermission="Withdraw_Pending_Interview">
                <Buttons
                  handleClick={handleWithdrawClick}
                  status="danger"
                  texts="Withdraw"
                />
              </Authorize>
            </>
          )}
        </>
      )}
      {/* Back Button */}
      {checkOnHold && (
        <Authorize
          allowedPermission={
            status === "1"
              ? "Pending_CV_Scanning"
              : status === "3"
                ? "Pending_Interview_Board"
                  : status === "15"
                    ? "Pending_Offer_Approval"
                    : status==="16"
                    ?"Pending Interview Results"
                    : ""
          }
        >
          <Onhold
            onUpdateSuccess={onUpdateSuccess}
            status={status}
            id={id || ""}
            checkOnHold={checkOnHold}
          />
        </Authorize>
      )}

      <Buttons
        status="cancel"
        texts="Close"
        handleClick={handleBackClick}
        className={styles.button}
      />

      {isScheduleModalOpen && (
        <>
          <Schedule
            applicant_email={applicant_email}
            id={id || ""}
            open={isScheduleModalOpen}
            onUpdateSuccess={() => {
              onUpdateSuccess();
              handleModalScheduleClose();
            }}
            onUpdateError={showSchuduleErrorToast}
            onCancel={handleModalScheduleClose}
            onScheduleSubmit={(data) => console.log("Received Data:", data)}
          />
        </>
      )}

      {isWithdrawModalOpen && (
        <WithDraw
          id={id || ""}
          open={isWithdrawModalOpen}
          onUpdateSuccess={() => {
            onUpdateSuccess();
            handleModalWithdrawClose();
          }}
          onUpdateError={showWithdrawErrorToast}
          onCancel={handleModalWithdrawClose}
        />
      )}
      {/* Send Offer */}
      {isSendOfferModalOpen && (
        <SendOffer
          id={id || ""}
          position_applied={position_applied}
          open={isSendOfferModalOpen}
          onUpdateSuccess={() => {
            onUpdateSuccess();
            handleModalSendOfferClose();
          }}
          onUpdateError={showSendOfferErrorToast}
          onCancel={handleModalSendOfferClose}
        />
      )}

      {/* Toast Container */}
      <ToastContainer autoClose={1500} />
    </div>
  );
};

export default Event;