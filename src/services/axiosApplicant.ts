import Http from "./Http";
import { createAxios } from './axios';
interface Config {
  headers?: Record<string, string>;
  params?: {
    page: number;
    per_page: number;
    status: string;
    position_applied: string;
    search:string;
    onHold:string;
    date_range:string
  };
}
const axiosInstance = createAxios();

export const getApplicants = async(params: any) => {
  const { page, per_page,position_applied, status,search,onHold,date_range } = params || {};
  const url = `api/v1/hrm/applicant/get?is_on_hold=${onHold}&page=${page}&per_page=${per_page}&date_range=${date_range}&status=${status}&position_applied=${position_applied}&search=${search}`;
  // const url = `api/v1/hrm/applicant/get_applicant_details?page=${page}&per_page=${per_page}&status=${status}&position_applied=${position_applied}&search=${search}`;
  try {
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getApplicantOnHolds = async(params: any) => {
  const { page, per_page,position_applied, status,search } = params || {};
  
  const url = `api/v1/hrm/applicant/get?is_on_hold=True&page=${page}&per_page=${per_page}&status=${status}&position_applied=${position_applied}&search=${search}`;
  // const url = `api/v1/hrm/applicant/get_applicant_details?page=${page}&per_page=${per_page}&status=${status}&position_applied=${position_applied}&search=${search}`;
  try {
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getApplicantDetail =async (id: number) => {
  const url = `api/v1/hrm/applicant/get?id=${id}`;
  // const url = `api/v1/hrm/applicant/get_applicant_details?id=${id}`;

  // Thực hiện yêu cầu GET
  try {
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  };
  };
  // get status
  export const getStatusList = async () => {
  try {
    const response = await axiosInstance.get(`api/v1/hrm/applicant/get_status`);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
  // Danh sách University
  export const getUniversity = async (params: any) => {
    const { page, per_page,search } = params || {};
  
    const url = `education/api/get_university?soft_delete=False&page=${page}&per_page=${per_page}&search=${search}`;
    try {
      const response = await axiosInstance.get(url);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const getUniversity1 = async () => {

    const url =`education/api/get_university?soft_delete=False&per_page=0`;
    try {
      const response = await axiosInstance.get(url);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const addUniversity =async ( data: any) => {
  
    const url = `api/v1/hrm/education/api/create_university`;
    try {
      const response = await axiosInstance.post(url, data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
 export const deleteUniversity = async (data: any) => {
    try {
      const response = await axiosInstance.post(`api/v1/hrm/education/delete_university`,data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
 export const getUniversityDetail = async (id?: string) => {
    try {
      const response = await axiosInstance.get(`education/api/get_university/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
 export const editUniversity = async (values: any) => {
    try {
      const response = await axiosInstance.post(`api/v1/hrm/education/update_university`, values);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const getAllCountry = async (params: any) => {
    const page = params?.page || 1;
      const per_page = params?.perPage || 5;
      const searchKey = params?.searchKey || '';
      let url=`education/api/get_country?page=${page}&per_page=${per_page}&search=${searchKey}`
    try {
  
      const response = await axiosInstance.get(url);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const getJob = (config: Config) => {
    const url = `api/v1/hrm/job/get_jobs`;
  
    return Http.get(url, {
      headers: config.headers,
    });
  };
  export const getAll_Job = async(params?: any) => {
    const page = params?.page || 1;
    const per_page = params?.perPage || 0;
    const searchKey = params?.searchKey || '';
    try {
      const response = await axiosInstance.get(`api/v1/hrm/job/job/get_position_apply?page=${page}&per_page=${per_page}&search=${searchKey}&sort=-id`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const updateApplicant = (id:number, data: any, config: any) => {
  
    const url = `api/v1/hrm/applicant/update_applicant/${id}`;
    return Http.post(url, data, {
      headers: config.headers,
    });
  };

  export const deleteApplicant = (data: any,config: Config) => {
    const url = `/api/v1/hrm/applicant/delete_applicant_by_id/${data.id}`;
  
    return Http.post(url, data, {
      headers: config.headers,
    });
  };
  export const updatePass=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/pass`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };
  export const updateFail=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/fail`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  };
  export const getDegree = async() => {;
    try {
      const response = await axiosInstance.get(`api/v1/hrm/applicant/get_degree`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const getDegreeType = async() => {;
    try {
      const response = await axiosInstance.get(`education/degree/get_degree_type`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  export const createApplicant=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/applicant/add_applicant`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  }
  export const returnApplicant=(data:any, config: Config)=>{
    const url = `api/v1/hrm/applicant/return`;
    return Http.post(url, data,{
      headers: config.headers,
    });
  }