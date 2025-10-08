import api, { MICROSERVICES, handleApiResponse, handleApiError } from '../../../services/api';
import { ApiResponse, PaginationParams } from '../../../types/api';
import { Opportunity, CreateOpportunityDTO, UpdateOpportunityDTO, OpportunityFilter, Quote } from '../../../types/sales';

class SalesService {
  private readonly BASE_URL = MICROSERVICES.sales;

  /**
   * Get all opportunities
   */
  async getOpportunities(pagination?: PaginationParams, filters?: OpportunityFilter): Promise<ApiResponse<Opportunity[]>> {
    try {
      const response = await api.get(`${this.BASE_URL}/opportunities`, {
        params: { ...pagination, ...filters },
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get opportunity by ID
   */
  async getOpportunityById(id: string): Promise<ApiResponse<Opportunity>> {
    try {
      const response = await api.get(`${this.BASE_URL}/opportunities/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Create new opportunity
   */
  async createOpportunity(data: CreateOpportunityDTO): Promise<ApiResponse<Opportunity>> {
    try {
      const response = await api.post(`${this.BASE_URL}/opportunities`, data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Update opportunity
   */
  async updateOpportunity(id: string, data: UpdateOpportunityDTO): Promise<ApiResponse<Opportunity>> {
    try {
      const response = await api.put(`${this.BASE_URL}/opportunities/${id}`, data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Delete opportunity
   */
  async deleteOpportunity(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`${this.BASE_URL}/opportunities/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get quotes for opportunity
   */
  async getQuotes(opportunityId: string): Promise<ApiResponse<Quote[]>> {
    try {
      const response = await api.get(`${this.BASE_URL}/opportunities/${opportunityId}/quotes`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Create quote
   */
  async createQuote(opportunityId: string, data: any): Promise<ApiResponse<Quote>> {
    try {
      const response = await api.post(`${this.BASE_URL}/opportunities/${opportunityId}/quotes`, data);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get sales pipeline stats
   */
  async getPipelineStats(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`${this.BASE_URL}/pipeline/stats`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default new SalesService();