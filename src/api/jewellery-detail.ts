import { AxiosResponse } from "axios";

import { Jewellery, JewelleryDetail } from "@/interface";
import { getToken } from "@/local-storage";

import {
  getJewelleryProdctEndpoint,
  getJewelleryProdctListEndpoint,
  getJewelleryProdctPriceEndpoint,
} from "./endpoints";
import callWebService from "./web-service";

export interface GetJewelleryDetailResponse {
  data: Array<Jewellery>;
  message: "Success" | "Failed";
}

export interface GetJewelleryProductDetail {
  data: JewelleryDetail;
  flag: boolean;
  message: "Success" | "Failed";
}

export interface GetJewelleryProductPrice {
  price: number;
  message: "Success" | "Failed";
}

const getJewelleryDetailID = (
  pageno: number
): Promise<AxiosResponse<GetJewelleryDetailResponse>> =>
  callWebService(getJewelleryProdctListEndpoint.url, {
    method: getJewelleryProdctListEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      pageno: pageno,
    },
  });

const getJewelleryProductList = (
  item_id: number
): Promise<AxiosResponse<GetJewelleryProductDetail>> =>
  callWebService(getJewelleryProdctEndpoint.url, {
    method: getJewelleryProdctEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      item_id: item_id,
    },
  });

const getJewelleryProductPrice = (
  itemgroup: string,
  slab: string,
  shape: string,
  color: string,
  quality: string
): Promise<AxiosResponse<GetJewelleryProductPrice>> =>
  callWebService(getJewelleryProdctPriceEndpoint.url, {
    method: getJewelleryProdctPriceEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      itemgroup: itemgroup,
      slab: slab,
      shape: shape,
      color: color,
      quality: quality,
    },
  });

export {
  getJewelleryDetailID,
  getJewelleryProductList,
  getJewelleryProductPrice,
};