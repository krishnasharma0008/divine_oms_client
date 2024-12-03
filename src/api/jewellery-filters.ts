import { AxiosResponse } from "axios";

import { getToken } from "@/local-storage";

import { GetProductCategoryEndpoint } from "./endpoints";
import callWebService from "./web-service";

export interface GetCategoryResponse {
  data: Array<string>;
}

const ProductCategory = (): Promise<AxiosResponse<GetCategoryResponse>> =>
  callWebService(GetProductCategoryEndpoint.url, {
    method: GetProductCategoryEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

export { ProductCategory };
