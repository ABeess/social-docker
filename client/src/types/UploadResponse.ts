export abstract class BaseResponse {
  code?: string;
  message?: string;
}

export interface Upload {
  url: string;
  fileName: string;
  type: string;
}

export interface UploadSingleResponse extends BaseResponse {
  upload: Upload;
}

export interface UploadMultipleResponse extends BaseResponse {
  uploads: Upload[];
}
