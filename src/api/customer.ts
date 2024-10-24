import { AxiosResponse } from "axios";

import { CustomerDetail } from "@/interface";
import { getToken } from "@/local-storage";

import { customerSearchEndpoint, customerCreateEndpoint } from "./endpoints";
import callWebService from "./web-service";

export interface GetCustomerDetailResponse {
  data: Array<CustomerDetail>;
}

const getCustomerDetailID = (
  id: number
): Promise<AxiosResponse<GetCustomerDetailResponse>> =>
  callWebService(customerSearchEndpoint.url + id, {
    method: customerSearchEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

const getCustomerDetailValue = (
  srcvalue: string
): Promise<AxiosResponse<GetCustomerDetailResponse>> =>
  callWebService(`${customerSearchEndpoint.url}find?value=` + srcvalue, {
    method: customerSearchEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

const createCustomer = (
  payload: CustomerDetail
): Promise<AxiosResponse<void>> => {
  return callWebService(customerCreateEndpoint.url, {
    method: customerCreateEndpoint.method,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    data: payload,
  });
};

export { getCustomerDetailID, getCustomerDetailValue, createCustomer };
