enum HTTP_METHOD {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export interface Endpoint {
  method: HTTP_METHOD;
  url: string;
}

export const loginGetOTPEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/api/getotp",
};

export const loginVerifyOTPEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/api/verifyotp",
};

export const loginEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/login",
};

export const customerSearchEndpoint: Endpoint = {
  method: HTTP_METHOD.GET,
  url: "/retail-customer/",
};

export const customerCreateEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/retail-customer/",
};

export const getJewelleryPjCustEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/erp/findcust",
};

export const getJewelleryPjStoreEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/erp/custlocation",
};

export const getJewelleryProdctListEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/erp/find-product",
};

export const getJewelleryProdctEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/erp/get-product",
};

//https://api2.divinesolitaires.com/softapi/erp/get-price
export const getJewelleryProdctPriceEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/get-price",
};

//create cart
export const CreateCartEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "cart/",
};

//Edit cart
export const EditCartEndpoint: Endpoint = {
  method: HTTP_METHOD.PUT,
  url: "cart/",
};

export const ListCartEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "cart/list",
};

export const DeleteCartEndpoint: Endpoint = {
  method: HTTP_METHOD.DELETE,
  url: "cart/",
};

export const CartOrderRemarkEndpoint: Endpoint = {
  method: HTTP_METHOD.PUT,
  url: "cart/updateorderrem",
};

export const CreateOrderEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "cart/toorder",
};

//old
// export const GetProductCategoryEndpoint: Endpoint = {
//   method: HTTP_METHOD.GET,
//   url: "erp/get-product-category",
// };

//new
export const GetFiltersEndpoint: Endpoint = {
  method: HTTP_METHOD.GET,
  url: "erp/get-filters",
};

export const OrderListEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "order/list",
};

export const OrderDetailEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "order/orderdetails",
};

export const UpdateOrderStatusEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/order/update-order-status",
};

export const GetCartExcelEndpoint: Endpoint = {
  method: HTTP_METHOD.GET,
  url: "/cart/getxl",
};

export const GetAdminOrderListExcelEndpoint: Endpoint = {
  method: HTTP_METHOD.GET,
  url: "/order/getxl/0",
};
