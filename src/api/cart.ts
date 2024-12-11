import { AxiosResponse } from "axios";

import { CartDetail } from "@/interface";
import { getToken } from "@/local-storage";

import {
  CreateCartEndpoint,
  ListCartEndpoint,
  DeleteCartEndpoint,
  CartOrderRemarkEndpoint,
  CreateOrderEndpoint,
  EditCartEndpoint,
} from "./endpoints";
import callWebService from "./web-service";

export interface GetCartDetailResponse {
  data: Array<CartDetail>;
  order_remarks: string;
}

interface CreateCartResponse {
  id: number;
}

interface EditCartResponse {
  msg: string;
}

interface CartorderremarkResponse {
  message: string;
}

interface cart_to_order_info {
  ids: string;
  product_type: string;
  orderno: number;
}

interface CartorderResponse {
  cart_to_order_info: Array<cart_to_order_info>;
  msg: string;
  success: boolean;
}

const getCartDetailList = (
  username: string
): Promise<AxiosResponse<GetCartDetailResponse>> =>
  callWebService(ListCartEndpoint.url, {
    method: ListCartEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      username: username,
    },
  });

const createCart = (
  payload: Array<CartDetail> // CartDetail
): Promise<AxiosResponse<CreateCartResponse>> => {
  return callWebService(CreateCartEndpoint.url, {
    method: CreateCartEndpoint.method,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    data: payload,
  });
};

const EditCart = (
  payload: CartDetail // CartDetail
): Promise<AxiosResponse<EditCartResponse>> => {
  return callWebService(EditCartEndpoint.url, {
    method: EditCartEndpoint.method,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    },
    data: payload,
  });
};

const DeleteCart = (id: number): Promise<AxiosResponse<{ success: boolean }>> =>
  callWebService(DeleteCartEndpoint.url + id, {
    method: DeleteCartEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

const UpdateCartOrderRemark = (
  username: string,
  remark: string
): Promise<AxiosResponse<CartorderremarkResponse>> =>
  callWebService(CartOrderRemarkEndpoint.url, {
    method: CartOrderRemarkEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      username: username,
      order_remarks: remark,
    },
  });

const CreateOrder = (
  order_ids: number[]
): Promise<AxiosResponse<CartorderResponse>> =>
  callWebService(CreateOrderEndpoint.url, {
    method: CreateOrderEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      ids: order_ids,
    },
  });

export {
  getCartDetailList,
  createCart,
  EditCart,
  DeleteCart,
  UpdateCartOrderRemark,
  CreateOrder,
};
