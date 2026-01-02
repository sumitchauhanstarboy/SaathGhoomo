// API service functions for booking management
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export interface BookingRequest {
  partnerId: string;
  date: string;
  time: string;
  duration: number;
  activity: string;
  totalCoins: number;
}

export interface Booking {
  id: string;
  booker: {
    id: string;
    name: string;
    email: string;
  };
  partner: {
    id: string;
    name: string;
    email: string;
  };
  date: string;
  time: string;
  duration: number;
  totalCoins: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'rejected';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface Companion {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  languages: string[];
  availability: string;
  pricePerHour: number;
  averageRating: number;
  totalReviews: number;
  isCompanion: boolean;
}

class BookingService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get available companions
  async getCompanions(filters?: {
    location?: string;
    activity?: string;
    search?: string;
  }): Promise<Companion[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.location) queryParams.append('location', filters.location);
      if (filters?.activity) queryParams.append('activity', filters.activity);
      if (filters?.search) queryParams.append('search', filters.search);

      const response = await fetch(`${API_BASE_URL}/users/companions?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch companions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching companions:', error);
      throw error;
    }
  }

  // Get companion by ID
  async getCompanionById(id: string): Promise<Companion> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/companions/${id}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch companion');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching companion:', error);
      throw error;
    }
  }

  // Create a booking
  async createBooking(bookingData: BookingRequest): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Get user's bookings
  async getUserBookings(type?: 'booker' | 'partner'): Promise<Booking[]> {
    try {
      const queryParams = new URLSearchParams();
      if (type) queryParams.append('type', type);

      const response = await fetch(`${API_BASE_URL}/bookings/my-bookings?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Get booking by ID
  async getBookingById(bookingId: string): Promise<Booking> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService();
