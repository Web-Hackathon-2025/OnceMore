import api from './api';

class BookingService {
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

