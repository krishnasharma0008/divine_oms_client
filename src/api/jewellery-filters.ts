import { AxiosResponse } from "axios";

import { getToken } from "@/local-storage";

import { GetFiltersEndpoint } from "./endpoints";
import callWebService from "./web-service";

export interface GetCategoryResponse {
  category: Array<string>;
  collection: Array<string>;
  sub_category: Array<string>;
}

const ProductFilters = (): Promise<AxiosResponse<GetCategoryResponse>> =>
  callWebService(GetFiltersEndpoint.url, {
    method: GetFiltersEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

export { ProductFilters };
