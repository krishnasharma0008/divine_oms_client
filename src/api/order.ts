import { AxiosResponse } from "axios";

import { getToken } from "@/local-storage";

import { OrderListEndpoint, OrderDetailEndpoint } from "./endpoints";
import callWebService from "./web-service";
import { OrderList } from "@/interface/order-list";
import { OrderDetail } from "@/interface/order-detail";

export interface GetOrderListResponse {
  data: Array<OrderList>;
  success: boolean;
}

export interface GetOrderDetailResponse {
  data: Array<OrderDetail>;
  order_remarks: string;
  success: boolean;
}

const getOrderList = (
  username: string
): Promise<AxiosResponse<GetOrderListResponse>> =>
  callWebService(OrderListEndpoint.url, {
    method: OrderListEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      username: username,
    },
  });

const getOrderDetail = (
  order_no: number
): Promise<AxiosResponse<GetOrderDetailResponse>> =>
  callWebService(OrderDetailEndpoint.url, {
    method: OrderDetailEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      orderno: order_no,
    },
  });

export { getOrderList, getOrderDetail };
