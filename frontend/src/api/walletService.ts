// API service functions for wallet management
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  bookingId?: string;
  referenceId?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  code: string;
  status: 'pending' | 'successful';
  coinsEarned: number;
  createdAt: string;
}

class WalletService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get user wallet
  async getWallet(): Promise<Wallet> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wallet');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  }

  // Get wallet transactions
  async getTransactions(type?: 'credit' | 'debit'): Promise<Transaction[]> {
    try {
      const queryParams = new URLSearchParams();
      if (type) queryParams.append('type', type);

      const response = await fetch(`${API_BASE_URL}/wallet/transactions?${queryParams}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Add coins to wallet
  async addCoins(amount: number, description: string, referenceId?: string): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/add`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ amount, description, referenceId })
      });

      if (!response.ok) {
        throw new Error('Failed to add coins');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding coins:', error);
      throw error;
    }
  }

  // Deduct coins from wallet
  async deductCoins(amount: number, description: string, bookingId?: string): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/deduct`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ amount, description, bookingId })
      });

      if (!response.ok) {
        throw new Error('Failed to deduct coins');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deducting coins:', error);
      throw error;
    }
  }

  // Get referral stats
  async getReferralStats(): Promise<{
    totalReferrals: number;
    successfulReferrals: number;
    totalCoinsEarned: number;
    referralCode: string;
    referrals: Referral[];
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/referral/stats`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch referral stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      throw error;
    }
  }

  // Generate referral code
  async generateReferralCode(): Promise<{ code: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/referral/generate`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to generate referral code');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating referral code:', error);
      throw error;
    }
  }

  // Apply referral code
  async applyReferralCode(code: string): Promise<{
    success: boolean;
    message: string;
    coinsEarned?: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/referral/apply`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error('Failed to apply referral code');
      }

      return await response.json();
    } catch (error) {
      console.error('Error applying referral code:', error);
      throw error;
    }
  }

  // Get wallet summary
  async getWalletSummary(): Promise<{
    currentBalance: number;
    totalEarned: number;
    totalSpent: number;
    thisMonthEarned: number;
    thisMonthSpent: number;
    pendingTransactions: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/summary`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wallet summary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching wallet summary:', error);
      throw error;
    }
  }

  // Transfer coins to another user
  async transferCoins(recipientId: string, amount: number, message: string): Promise<Transaction> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/transfer`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ recipientId, amount, message })
      });

      if (!response.ok) {
        throw new Error('Failed to transfer coins');
      }

      return await response.json();
    } catch (error) {
      console.error('Error transferring coins:', error);
      throw error;
    }
  }
}

export const walletService = new WalletService();
