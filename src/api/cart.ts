import { AxiosResponse } from "axios";

import { CartDetail } from "@/interface";
import { getToken } from "@/local-storage";

import {
  CreateCartEndpoint,
  ListCartEndpoint,
  DeleteCartEndpoint,
} from "./endpoints";
import callWebService from "./web-service";

export interface GetCartDetailResponse {
  data: Array<CartDetail>;
}

interface CreateCartResponse {
  id: number;
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

export { getCartDetailList, createCart, DeleteCart };
