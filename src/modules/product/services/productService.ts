import api, { MICROSERVICES, handleApiResponse, handleApiError } from '../../../services/api';
import { ApiResponse, PaginationParams, FilterParams } from '../../../types/api';
import { Product, CreateProductDTO, UpdateProductDTO, ProductFilter, ProductCategory } from '../../../types/product';

class ProductService {
  private readonly BASE_URL = MICROSERVICES.product;

  /**
   * Get all products with pagination and filters
   */
  async getProducts(
    pagination?: PaginationParams,
    filters?: ProductFilter
  ): Promise<ApiResponse<Product[]>> {
    try {
      const response = await api.get(this.BASE_URL, {
        params: { ...pagination, ...filters },
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await api.get(`${this.BASE_URL}/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProductDTO): Promise<ApiResponse<Product>> {
    try {
      const response = await api.post(this.BASE_URL, data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: UpdateProductDTO): Promise<ApiResponse<Product>> {
    try {
      const response = await api.put(`${this.BASE_URL}/${id}`, data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`${this.BASE_URL}/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    try {
      const response = await api.get(`${this.BASE_URL}/categories`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Update product stock
   */
  async updateStock(id: string, quantity: number): Promise<ApiResponse<Product>> {
    try {
      const response = await api.patch(`${this.BASE_URL}/${id}/stock`, { quantity });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Upload product images
   */
  async uploadImages(id: string, images: File[]): Promise<ApiResponse<string[]>> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await api.post(`${this.BASE_URL}/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default new ProductService();