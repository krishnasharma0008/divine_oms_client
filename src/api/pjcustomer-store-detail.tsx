import { AxiosResponse } from "axios";

import { getToken } from "@/local-storage";

import {
  getJewelleryPjCustEndpoint,
  getJewelleryPjStoreEndpoint,
} from "./endpoints";
import callWebService from "./web-service";
import { PJCustomerStoreDetail } from "@/interface/pj-custome-store";

export interface GetJewellerypjCustResponse {
  data: Array<string>;
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

export { getpjCustomer, getpjStore };
