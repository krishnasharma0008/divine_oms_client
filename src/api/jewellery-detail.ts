import { AxiosResponse } from "axios";

import { JewelleryDetail } from "@/interface";
import { getToken } from "@/local-storage";

import { getJewelleryProdctListEndpoint } from "./endpoints";
import callWebService from "./web-service";

export interface GetJewelleryDetailResponse {
  data: Array<JewelleryDetail>;
}

const getJewelleryDetailID = (
  pageno:number
): Promise<AxiosResponse<GetJewelleryDetailResponse>> =>
  callWebService(getJewelleryProdctListEndpoint.url, {
    method: getJewelleryProdctListEndpoint.method,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: {
      pageno: pageno,
    },
  });

export { getJewelleryDetailID };
