import axios, { AxiosResponse } from 'axios';
import { UploadMultipleResponse, UploadSingleResponse } from 'src/types/UploadResponse';

export const uploadSingle = async (data: FormData): Promise<UploadSingleResponse> => {
  const res = await axios({
    method: 'POST',
    url: `${import.meta.env.VITE_APP_BASE_URL}/upload-single`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: data,
    withCredentials: true,
  });
  return res.data;
};

export const uploadMultiple = async (data: FormData): Promise<UploadMultipleResponse> => {
  const res: AxiosResponse<UploadMultipleResponse> = await axios({
    method: 'POST',
    url: `${import.meta.env.VITE_APP_BASE_URL}/upload-multiple`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: data,
    withCredentials: true,
  });
  return res.data;
};
