export type WorryCategory = 'relationship' | 'career' | 'mental' | 'work' | 'money' | 'daily';

export interface ReceiptItem {
  id: string;
  name: string;
  qty: number;
  emotionalCost: string;
}

export interface ReceiptDiscount {
  id: string;
  name: string;
  amount: string;
}

export interface Receipt {
  id: string;
  created_at: string;
  customer_name: string;
  category: WorryCategory;
  category_label: string;
  worry_content: string;
  worry_weight: number;
  worry_weight_unit: string;
  worry_expiry: string;
  spell: string;
  
  items: ReceiptItem[];
  subtotal: string;
  discounts: ReceiptDiscount[];
  final_price: string;
  payment_method: string;
  
  remedy_title: string;
  remedy_desc: string;
  lucky_item: string;
  lucky_color: string;
  barcode_number: string;
  
  likes_count: number;
  is_public: boolean;
}

export interface WorryFormData {
  customer_name: string;
  category: WorryCategory;
  worry_content: string;
  worry_weight: number;
  worry_expiry: string;
  spell: string;
  is_public: boolean;
}
