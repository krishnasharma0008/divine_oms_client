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
  item_number: string,
  product_category: string,
  shape: string,
  pageno: number
): Promise<AxiosResponse<GetJewelleryDetailResponse>> =>
  callWebService(getJewelleryProdctListEndpoint.url, {
    method: getJewelleryProdctListEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      item_number: item_number === "" ? null : item_number,
      product_category: product_category === "" ? null : product_category,
      shape: shape === "" ? null : shape,
      pageno: pageno,
    },
  });

const getJewelleryProductList = (
  product_code: string
): Promise<AxiosResponse<GetJewelleryProductDetail>> =>
  callWebService(getJewelleryProdctEndpoint.url, {
    method: getJewelleryProdctEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      product_code: product_code,
    },
  });

const getJewelleryProductPrice = (
  itemgroup: string,
  slab?: string,
  shape?: string,
  color?: string,
  quality?: string
): Promise<AxiosResponse<GetJewelleryProductPrice>> =>
  callWebService(getJewelleryProdctPriceEndpoint.url, {
    method: getJewelleryProdctPriceEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      itemgroup: itemgroup,
      slab: slab === "" ? null : slab,
      shape: shape === "" ? null : shape,
      color: color,
      quality: quality,
    },
  });

export {
  getJewelleryDetailID,
  getJewelleryProductList,
  getJewelleryProductPrice,
};
