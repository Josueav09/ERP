export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  sku: string;
  images: string[];
  variants?: ProductVariant[];
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  stock: number;
  sku: string;
  images?: string[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  stock?: number;
  status?: 'active' | 'inactive' | 'out_of_stock';
}

export interface ProductFilter {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}