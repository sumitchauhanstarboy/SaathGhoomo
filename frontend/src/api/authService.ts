import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, googleProvider, firebaseEnabled, validateFirebaseProject } from "@/lib/firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

// Register with email and password
export const registerWithEmail = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    if (credentials.password !== credentials.confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Registration failed",
    };
  }
};

// Login with email and password
export const loginWithEmail = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success) {
      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
};

// Google Sign In / Sign Up
export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    // Ensure Firebase is configured and project is valid before opening popup
    if (!firebaseEnabled) {
      return {
        success: false,
        message: "Google sign-in is not configured. Please set VITE_FIREBASE_* environment variables.",
      };
    }

    const valid = await validateFirebaseProject();
    if (!valid) {
      return {
        success: false,
        message:
          "Google Firebase project configuration not found (CONFIGURATION_NOT_FOUND). Please enable Firebase Authentication and Google Sign-In in your Firebase console.",
      };
    }

    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Get Firebase token
    const firebaseToken = await firebaseUser.getIdToken();

    // Send to backend for verification and token generation
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify({
        googleId: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        profileImage: firebaseUser.photoURL,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Google sign-in failed",
    };
  }
};

// Refresh Access Token
export const refreshAccessToken = async (): Promise<AuthResponse> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return {
        success: false,
        message: "No refresh token found",
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Token refresh failed",
    };
  }
};

// Logout
export const logout = async (): Promise<AuthResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    }

    // Clear Firebase session (only if initialized)
    if (firebaseEnabled && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("Firebase signOut failed:", e);
      }
    }

    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    // Clear tokens anyway
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return {
      success: false,
      message: error.message || "Logout failed",
    };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found",
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch user",
    };
  }
};

// Setup axios/fetch interceptor for automatic token refresh
export const setupAuthInterceptor = () => {
  // This can be called in App.tsx to setup automatic token refresh
  const originalFetch = window.fetch;

  window.fetch = async (...args: any[]) => {
    let response = await originalFetch(args[0], args[1]);

    if (response.status === 401) {
      const refreshResult = await refreshAccessToken();
      if (refreshResult.success) {
        // Retry original request with new token
        const headers = new Headers(args[1]?.headers || {});
        headers.set("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
        response = await originalFetch(args[0], { ...args[1], headers });
      }
    }

    return response;
  };
};
