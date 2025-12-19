import api from './api';

class ServiceService {
  // Create a new service
  async createService(serviceData) {
    try {
      const response = await api.post('/services', serviceData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all services for current provider
  async getMyServices() {
    try {
      const response = await api.get('/services/my-services');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get a single service
  async getService(serviceId) {
    try {
      const response = await api.get(`/services/${serviceId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update a service
  async updateService(serviceId, serviceData) {
    try {
      const response = await api.put(`/services/${serviceId}`, serviceData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete a service
  async deleteService(serviceId) {
    try {
      const response = await api.delete(`/services/${serviceId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ServiceService();

