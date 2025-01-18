export interface CustomerOrderDetail {
  order_for: string;
  customer_id?: number;
  product_type: string;
  //consignment_type: string;
  //sale_or_return: string;
  //outright_purchase: string;
  //customer_order: string;
  order_type: string; //
  cust_code: string;
  cust_name: string;
  store: string;
  contactno: string;
  address: string;
  exp_dlv_date: string;
  old_varient: string;
}
