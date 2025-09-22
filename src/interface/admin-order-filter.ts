export interface AdminOrderFilters {
  order_status: string;
  orderno: string;
  order_createdat: Date | null;
  customer_name: string;
  customer_branch: string;
  product_type: string;
  order_for: string;
  exp_dlv_date: Date | null;
}
