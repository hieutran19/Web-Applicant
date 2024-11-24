import Http from "./Http";
import { createAxios } from './axios';
interface Config {
    headers?: Record<string, string>;
  }
  const axiosInstance = createAxios();
export const getAuditHistory =async (id: number) => {
    try {
      const response = await axiosInstance.get(`api/v1/hrm/applicant/getAudit?applicant_id=${id}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const postWithdraw=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/withdraw`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };

  export const postSchedule=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/schedule`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };
  export const postOffer=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/send_offer`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };
  export const postDeclineOffer=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/decline_offering`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };
  export const postOfferApproval=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/approve_reject_company_offer`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };
  export const postAccept_decline_offer=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/accept_decline_offering`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };
  export const postReject_candidate=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/reject_candidate`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };
  export const postDecline_Offer=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/accept_decline_offering`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };
  export const get_email_employee = (config: Config) => {
    const url = `api/v1/hrm/job/job/get_interview_board?per_page=0`;
  
    return Http.get(url, {
      headers: config.headers,
    });
  };
  export const getOfferInfor = async(id) => {

    try {
      const response = await axiosInstance.get(`api/v1/hrm/applicant/get_offering?applicant_id=${id}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const postOnHold =async (data:any) => {
    try {
      const response = await axiosInstance.post(`api/v1/hrm/applicant/put_on_hold`, data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const postRemark=async (data: any) => {
    try {
      const response = await axiosInstance.post(`api/v1/hrm/applicant/add_remarks`, data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };