// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API Client with authentication
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(includeAuth: boolean = false, isFormData: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = false,
    isFormData: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(requiresAuth, isFormData);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, requiresAuth);
  }

  async post<T>(
    endpoint: string,
    data: any,
    requiresAuth: boolean = false,
    isFormData: boolean = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data),
      },
      requiresAuth,
      isFormData
    );
  }

  async put<T>(
    endpoint: string,
    data: any,
    requiresAuth: boolean = false,
    isFormData: boolean = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: isFormData ? data : JSON.stringify(data),
      },
      requiresAuth,
      isFormData
    );
  }

  async delete<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, requiresAuth);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile_picture?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  profile_picture?: File;
}

export interface PaymentHistory {
  id: number;
  user_id: string;
  amount_paid: number;
  status: string;
  payment_date: string;
  created_at: string;
}

export interface Analytics {
  total_amount_paid: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/login', { email, password });
  },

  register: async (data: RegisterData): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);
    
    if (data.profile_picture) {
      formData.append('profile_picture', data.profile_picture);
    }

    return apiClient.post<{ message: string }>('/register', formData, false, true);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// User API
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/user', true);
  },

  getUserDetails: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<ApiResponse<User>>('/user/details', true);
  },

  getPaymentHistory: async (): Promise<ApiResponse<PaymentHistory[]>> => {
    return apiClient.get<ApiResponse<PaymentHistory[]>>('/user/payment-history', true);
  },

  getAnalytics: async (): Promise<ApiResponse<Analytics>> => {
    return apiClient.get<ApiResponse<Analytics>>('/user/analytics', true);
  },

  editProfile: async (data: Partial<User> & { profile_picture?: File }): Promise<ApiResponse<User>> => {
    // If there's a profile picture, use FormData
    if (data.profile_picture) {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.email) formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      formData.append('profile_picture', data.profile_picture);
      formData.append('_method', 'PUT'); // Laravel method spoofing for file uploads
      
      return apiClient.post<ApiResponse<User>>('/user/edit-profile', formData, true, true);
    }
    
    // Otherwise send JSON
    const payload: any = {};
    if (data.name) payload.name = data.name;
    if (data.email) payload.email = data.email;
    if (data.phone) payload.phone = data.phone;
    
    return apiClient.put<ApiResponse<User>>('/user/edit-profile', payload, true, false);
  },

  changePassword: async (
    current_password: string,
    new_password: string,
    new_password_confirmation: string
  ): Promise<ApiResponse<null>> => {
    return apiClient.put<ApiResponse<null>>(
      '/user/change-password',
      { current_password, new_password, new_password_confirmation },
      true
    );
  },
};
