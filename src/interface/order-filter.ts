export interface OrderFilters {
  orderno: string;
  order_createdat: Date | null; // keep as Date in state
  customer_name: string;
  customer_branch: string;
  product_type: string;
  order_for: string;
  exp_dlv_date: Date | null; // keep as Date in state
}
