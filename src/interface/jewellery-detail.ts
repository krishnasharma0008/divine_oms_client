interface Image {
  color: string;
  image_url: string[];
}

export interface JewelleryDetail {
  Item_id: number;
  Item_number: string;
  Product_name: string;
  
  Product_category: string;//
  Product_sub_category: string;
  Sub_catagory_2: string;
  Sub_catagory_3: string;
  Sub_catagory_4: string;
  Style: string;
  Wear_style: string;
  Look: string;
  Status: string;
  Product_description: string;
  Remark: string;
  Product_range_from: string;
  Product_range_to: string;
  old_varient: string;
  Product_range_from_min: string;
  Product_range_to_max: string;
  Product_size_from: string;
  Product_size_to: string;
  Metal_color: string;
  Metal_purity: string;
  Current_status: string;
  Portfolio_type: string;
  Collection: string;
  Gender: string;
  Variant_approved_date: string; //null
  // solitaire_slab: string;
  // weight: string;
  // bom_variant_name: string;
  // image_url: string;
  Cts_size_slab: [];
  Images: Image[];
  Variants: [
    {
      Variant_id: string;
      Product_id: string;
      Variant_name: string;
      Metal_purity: string;
      Solitaire_slab: string;
      Size: string;
      Is_base_variant: string;
      Variant_approved_date: string;
      Rhodium_instruction: string;
      Special_instruction: string;
      Customer: string;
      For_web: string;
      Status: string;
    }
  ];
  Bom: [
    {
      Bom_id: string;
      Product_id: string;
      Variant_id: string;
      Item_type: string;
      Item_group: string;
      Bom_variant_name: string;
      Pcs?: number;
      Avg_weight: string;
      Weight?: number;
    }
  ];
}
