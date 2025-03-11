import { AxiosResponse } from "axios";

import { getToken } from "@/local-storage";

import {
  getJewelleryPjCustEndpoint,
  getJewelleryPjStoreEndpoint,
} from "./endpoints";
import callWebService from "./web-service";
import { PJCustomerStoreDetail } from "@/interface/pj-custome-store";

// export interface GetJewellerypjCustResponse {
//   data: Array<string>;
// }

export interface Customer {
  code: string;
  name: string;
}

export interface GetJewellerypjCustResponse {
  data: Customer[];
}

export interface GetJewellerypjCustStoreResponse {
  data: Array<PJCustomerStoreDetail>;
}

const getpjCustomer = (
  custName?: string
): Promise<AxiosResponse<GetJewellerypjCustResponse>> =>
  callWebService(getJewelleryPjCustEndpoint.url, {
    method: getJewelleryPjCustEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      name: custName,
    },
  });

const getpjStore = (
  code?: string
  //,code?:string
): Promise<AxiosResponse<GetJewellerypjCustStoreResponse>> =>
  callWebService(getJewelleryPjStoreEndpoint.url, {
    method: getJewelleryPjStoreEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      code: code,
      //code:code,
    },
  });

export { getpjCustomer, getpjStore };
