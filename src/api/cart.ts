import { AxiosResponse } from "axios";

import { CartDetail } from "@/interface";
import { getToken } from "@/local-storage";

import {
  CreateCartEndpoint,
  ListCartEndpoint,
  DeleteCartEndpoint,
  CartOrderRemarkEndpoint,
  CreateOrderEndpoint,
} from "./endpoints";
import callWebService from "./web-service";

export interface GetCartDetailResponse {
  data: Array<CartDetail>;
  order_remarks: string;
}

interface CreateCartResponse {
  id: number;
}

interface CartorderremarkResponse {
  message: string;
}

interface CartorderResponse {
  msg: string;
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

// const createCart = (payload: CartDetail): Promise<AxiosResponse<CreateCartResponse>> => {
//   return callWebService(CreateCartEndpoint.url, {
//     method: CreateCartEndpoint.method,
//     maxBodyLength: Infinity,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + getToken(),
//     },
//     data: payload,
//   });
// };

const createCart = (
  payload: CartDetail
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

const CreateOrderRemark = (
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
  DeleteCart,
  UpdateCartOrderRemark,
  CreateOrderRemark,
};
