import api from './api';

class BookingService {
  // ========== CUSTOMER METHODS ==========
  
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', bookingData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get customer bookings
  async getCustomerBookings(status = null, page = 1, limit = 10) {
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      const response = await api.get(`/bookings/my-bookings?${queryParams.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update booking status (customer)
  async updateBookingStatus(bookingId, status, cancellationReason = null) {
    try {
      const response = await api.put(`/bookings/${bookingId}/status`, {
        status,
        cancellationReason
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add message to booking
  async addMessage(bookingId, message) {
    try {
      const response = await api.post(`/bookings/${bookingId}/messages`, { message });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== PROVIDER METHODS ==========
  
  // Get all bookings for provider
  async getProviderBookings(status = null) {
    try {
      const url = status ? `/bookings/provider?status=${status}` : '/bookings/provider';
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get booking history
  async getBookingHistory() {
    try {
      const response = await api.get('/bookings/provider/history');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get a single booking
  async getBooking(bookingId) {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Accept a booking
  async acceptBooking(bookingId) {
    try {
      const response = await api.put(`/bookings/${bookingId}/accept`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reject a booking
  async rejectBooking(bookingId, reason) {
    try {
      const response = await api.put(`/bookings/${bookingId}/reject`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reschedule a booking
  async rescheduleBooking(bookingId, scheduledDate, scheduledTime) {
    try {
      const response = await api.put(`/bookings/${bookingId}/reschedule`, {
        scheduledDate,
        scheduledTime
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new BookingService();

