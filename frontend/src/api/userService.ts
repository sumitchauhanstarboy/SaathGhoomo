// API service functions for user profile management
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  location: string;
  bio?: string;
  interests: string[];
  languages: string[];
  availability?: string;
  pricePerHour?: number;
  isCompanion: boolean;
  averageRating?: number;
  totalReviews?: number;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  totalSpent: number;
  averageRating: number;
  totalReviews: number;
  referralCount: number;
}

class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Upload profile image
  async uploadProfileImage(file: File): Promise<{ profileImage: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/users/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile image');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/stats`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Toggle companion status
  async toggleCompanionStatus(isCompanion: boolean): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/companion-status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ isCompanion })
      });

      if (!response.ok) {
        throw new Error('Failed to update companion status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating companion status:', error);
      throw error;
    }
  }

  // Update companion settings
  async updateCompanionSettings(settings: {
    availability: string;
    pricePerHour: number;
  }): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/companion-settings`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to update companion settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating companion settings:', error);
      throw error;
    }
  }

  // Get user reviews
  async getUserReviews(type?: 'given' | 'received'): Promise<{
    id: string;
    rating: number;
    comment: string;
    reviewer: {
      id: string;
      name: string;
      profileImage?: string;
    };
    bookingId: string;
    createdAt: string;
  }[]> {
    try {
      const queryParams = new URLSearchParams();
      if (type) queryParams.append('type', type);

      const response = await fetch(`${API_BASE_URL}/users/reviews?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }

  // Delete user account
  async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/delete-account`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      return await response.json();
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Get user favorites
  async getFavorites(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  // Add to favorites
  async addToFavorite(userId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  // Remove from favorites
  async removeFromFavorite(userId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
