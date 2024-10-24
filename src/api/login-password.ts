import { AxiosResponse } from "axios";

import { loginEndpoint } from "./endpoints";
import callWebService from "./web-service";

export interface LoginResponse {
  dpname: string;
  message: "SUCCESS" | "FAILURE";
  role: string;
  token: string;
}

const loginPasswordApi = (
  username: string,
  password: string
): Promise<AxiosResponse<LoginResponse>> =>
  callWebService(loginEndpoint.url, {
    method: loginEndpoint.method,
    data: {
      username,
      password,
    },
  });

export default loginPasswordApi;
