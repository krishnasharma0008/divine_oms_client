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
  total_found: number;
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
  product_sub_category: string,
  collection: string,
  metal_purity: string,
  portfolio_type: string,
  pageno: number,
  newlaunch: boolean,
  discarded: boolean,
  gender: string,
  price_from: string,
  price_to: string
): Promise<AxiosResponse<GetJewelleryDetailResponse>> =>
  callWebService(getJewelleryProdctListEndpoint.url, {
    method: getJewelleryProdctListEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      item_number: item_number === "" ? null : item_number,
      product_category: product_category === "" ? null : product_category,
      product_sub_category:
        product_sub_category === "" ? null : product_sub_category,
      collection: collection === "" ? null : collection,
      metal_purity: metal_purity === "" ? null : metal_purity,
      portfolio_type: portfolio_type === "" ? null : portfolio_type,
      pageno: pageno,
      is_new_launch: newlaunch,
      discarded: discarded,
      gender: gender === "" ? null : gender,
      price_from: price_from === "" ? null : price_from,
      price_to: price_to === "" ? null : price_to,
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
      weight: slab && slab !== "" ? parseFloat(slab) : null,
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
