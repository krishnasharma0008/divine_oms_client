import { AxiosResponse } from "axios";

//import { getToken } from "@/local-storage";

import {
  OrderListEndpoint,
  OrderDetailEndpoint,
  UpdateOrderStatusEndpoint,
  GetAdminOrderListExcelEndpoint,
  GetAdminOrderExcelEndpoint,
} from "./endpoints";
import callWebService from "./web-service";
import { OrderList } from "@/interface/order-list";
import { OrderDetail } from "@/interface/order-detail";
import { getAdminToken } from "@/local-storage";
//import dayjs from "dayjs";

export interface GetOrderListResponse {
  data: Array<OrderList>;
  total_page: number;
  total_row: number;
  success: boolean;
}

export interface GetOrderDetailResponse {
  data: Array<OrderDetail>;
  order_remarks: string;
  success: boolean;
}

export interface GetOrderStatusResponse {
  msg: string;
  success: boolean;
}

export interface OrderFiltersApi {
  orderno: string;
  order_createdat: string | null; // formatted YYYY-MM-DD
  customer_name: string;
  customer_branch: string;
  product_type: string;
  order_for: string;
  exp_dlv_date: string | null; // formatted YYYY-MM-DD
}

const getOrderList = (
  username: string,
  pageno: number,
  token: string,
  //filters: OrderFilters = {}
  filters: OrderFiltersApi
): Promise<AxiosResponse<GetOrderListResponse>> => {
  console.log("filters.orderno:", filters.orderno);
  return callWebService(OrderListEndpoint.url, {
    method: OrderListEndpoint.method,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: {
      username: username,
      pageno: pageno,
      //...filters,
      orderno:
        filters.orderno === "" || isNaN(Number(filters.orderno))
          ? null
          : Number(filters.orderno),
      order_createdat: filters.order_createdat,
      customer_name: filters.customer_name || null,
      customer_branch: filters.customer_branch || null,
      product_type: filters.product_type || null,
      order_for: filters.order_for || null,
      exp_dlv_date: filters.exp_dlv_date,
    },
  });
};

const getOrderDetail = (
  order_no: number,
  token: string
): Promise<AxiosResponse<GetOrderDetailResponse>> =>
  callWebService(OrderDetailEndpoint.url, {
    method: OrderDetailEndpoint.method,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: {
      orderno: order_no,
    },
  });

const updateOrderStatus = (
  order_no: number,
  status: string,
  token: string
): Promise<AxiosResponse<GetOrderStatusResponse>> =>
  callWebService(UpdateOrderStatusEndpoint.url, {
    method: UpdateOrderStatusEndpoint.method,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: {
      orderno: order_no,
      order_status: status,
    },
  });

const DownloadOrderListExcel = async (): Promise<AxiosResponse<Blob>> => {
  return callWebService(GetAdminOrderListExcelEndpoint.url, {
    method: GetAdminOrderListExcelEndpoint.method,
    headers: {
      Authorization: "Bearer " + getAdminToken(),
    },
    responseType: "blob",
    timeout: 60000, // 60 seconds timeout
  });
};

const DownloadAdminOrderExcel = async (
  orderno: number
): Promise<AxiosResponse<Blob>> => {
  return callWebService(GetAdminOrderExcelEndpoint.url + orderno, {
    method: GetAdminOrderExcelEndpoint.method,
    headers: {
      Authorization: "Bearer " + getAdminToken(),
    },
    responseType: "blob",
    timeout: 60000, // 60 seconds timeout
  });
};

export {
  getOrderList,
  getOrderDetail,
  updateOrderStatus,
  DownloadOrderListExcel,
  DownloadAdminOrderExcel,
};
