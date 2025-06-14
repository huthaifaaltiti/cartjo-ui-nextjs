export type CommonResponse = {
  isSuccess: boolean;
  message: string;
};

export type DeleteUserResponse = CommonResponse;
export type UnDeleteUserResponse = CommonResponse;
export type SwitchUserActiveStatusResponse = CommonResponse;
