import { AxiosResponse } from "axios";

import { JewelleryDetail } from "@/interface";
import { getToken } from "@/local-storage";

import {
  getJewelleryPjCustEndpoint,
  getJewelleryPjStoreEndpoint,
  getJewellerySearchEndpoint,
} from "./endpoints";
import callWebService from "./web-service";
import { JewelleryPJStoreDetail } from "@/interface/pj-custome-store";

export interface GetJewelleryDetailResponse {
  data: Array<JewelleryDetail>;
}

export interface GetJewellerypjCustResponse {
  data: Array<string>;
}

export interface GetJewellerypjCustStoreResponse {
  data: Array<JewelleryPJStoreDetail>;
}

const getJewelleryDetailID = (
  id: number
): Promise<AxiosResponse<GetJewelleryDetailResponse>> =>
  callWebService(getJewellerySearchEndpoint.url + id, {
    method: getJewellerySearchEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

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
  custName?: string
): Promise<AxiosResponse<GetJewellerypjCustStoreResponse>> =>
  callWebService(getJewelleryPjStoreEndpoint.url, {
    method: getJewelleryPjStoreEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      name: custName,
    },
  });
// const createCustomer = (
//   payload: CustomerDetail
// ): Promise<AxiosResponse<void>> => {
//   return callWebService(customerCreateEndpoint.url, {
//     method: customerCreateEndpoint.method,
//     maxBodyLength: Infinity,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + getToken(),
//     },
//     data: payload,
//   });
// };

export { getJewelleryDetailID, getpjCustomer, getpjStore };
