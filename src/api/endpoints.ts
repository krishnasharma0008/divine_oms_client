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
  url: "/erp/get-price",
};

//cart
export const CreateCartEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
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
