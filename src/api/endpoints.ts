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
  url: "/pj/findcust",
};

export const getJewelleryPjStoreEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/pj/custlocation",
};

export const getJewelleryProdctListEndpoint: Endpoint = {
  method: HTTP_METHOD.POST,
  url: "/pj/find-product",
};
