export interface CartDetail {
  id?: number;
  order_for: string;
  customer_id: number;
  customer_name: string;
  customer_branch: string;
  order_type: string;
  product_type: string; //new
  Product_category: string; //new ring,coint,pendent
  //consignment_type: string;
  //sale_or_return: string;
  //outright_purchase: boolean;
  //customer_order: string;
  exp_dlv_date: Date | null; // date
  old_varient: string; //new
  product_code: string;
  product_qty: number;
  product_amt_min: number;
  product_amt_max: number;
  solitaire_shape: string;
  solitaire_slab: string;
  solitaire_color: string;
  solitaire_quality: string;
  solitaire_prem_size: string;
  solitaire_prem_pct: number;
  solitaire_amt_min: number;
  solitaire_amt_max: number;
  metal_type: string; //gold,silver new
  metal_purity: string;
  metal_color: string;
  metal_weight: number;
  metal_price: number; //new
  mount_amt_min: number; //new
  mount_amt_max: number; //new
  size_from: string;
  size_to: string;
  side_stone_pcs: number;
  side_stone_cts: number;
  side_stone_color: string;
  side_stone_quality: string;
  cart_remarks: string;
  order_remarks: string;
  image_url?: string;
}
