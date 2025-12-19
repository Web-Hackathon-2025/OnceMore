import api from './api';

class ReviewService {
  // Submit a review
  async submitReview(reviewData) {
    try {
      const response = await api.post('/reviews', reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get customer reviews
  async getCustomerReviews(page = 1, limit = 10) {
    try {
      const response = await api.get(`/reviews/my-reviews?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ReviewService();

