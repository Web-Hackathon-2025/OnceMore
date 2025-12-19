import api from './api';

class ServiceProviderService {
  // Get all service providers
  async getAllServiceProviders(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.serviceType) queryParams.append('serviceType', filters.serviceType);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.minRating) queryParams.append('minRating', filters.minRating);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.page) queryParams.append('page', filters.page);

      const url = `/service-providers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get service provider by ID
  async getServiceProviderById(providerId) {
    try {
      const response = await api.get(`/service-providers/${providerId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get service provider reviews
  async getServiceProviderReviews(providerId, page = 1, limit = 10) {
    try {
      const response = await api.get(`/service-providers/${providerId}/reviews?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get service provider availability
  async getServiceProviderAvailability(providerId) {
    try {
      const response = await api.get(`/service-providers/${providerId}/availability`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ServiceProviderService();

