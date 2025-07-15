export type CommonResponse = {
  isSuccess: boolean;
  message: string;
};

export interface CommonListResponse<T> {
  isSuccess: boolean;
  message: string;
  totalCount: number;
  data: T[];
}

export type DeletingResponse = CommonResponse;
export type SwitchActiveStatusResponse = CommonResponse;

// ---

export interface Name {
  ar: string;
  en: string;
}

export type Description = Name;

// ---

export interface FetchPaginatedArgs {
  token: string;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
}

// --

export interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}
