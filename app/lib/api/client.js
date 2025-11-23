const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * API Endpoints
 * Centralized endpoint definitions for maintainability
 */
export const API_ENDPOINTS = {
  STATS: '/api/stats',
  TASKS: '/api/tasks',
  PROJECTS: '/api/projects',
  PROJECT_BY_ID: (id) => `/api/projects/${id}`,
  PERFORMANCE: '/api/performance',
  SUMMARY: '/api/summary',
  DASHBOARD: '/api/dashboard',
  HEALTH: '/health',
};

/**
 * HTTP Client
 * Simple fetch wrapper with error handling and retries
 */
class ApiClient {
  constructor(config) {
    this.baseURL = config.BASE_URL;
    this.timeout = config.TIMEOUT;
    this.retryAttempts = config.RETRY_ATTEMPTS;
    this.retryDelay = config.RETRY_DELAY;
  }

  /**
   * Build full URL
   */
  buildUrl(endpoint) {
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * Sleep utility for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generic request method with retry logic
   */
  async request(endpoint, options = {}, attempt = 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Retry logic for network errors
      if (attempt < this.retryAttempts && this.isRetryableError(error)) {
        await this.sleep(this.retryDelay * attempt);
        return this.request(endpoint, options, attempt + 1);
      }

      throw this.handleError(error);
    } finally {
      // Always clear timeout to prevent memory leaks
      clearTimeout(timeoutId);
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error) {
    // Don't retry client errors (4xx)
    if (error.message && error.message.includes('HTTP 4')) {
      return false;
    }
    
    return (
      error.name === 'AbortError' ||
      error.message.includes('HTTP 5') || // Retry server errors
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    );
  }

  /**
   * Error handler
   */
  handleError(error) {
    if (error.name === 'AbortError') {
      return new Error('Request timeout');
    }
    return error;
  }

  /**
   * GET request
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_CONFIG);

/**
 * API Service Functions
 * High-level API functions following Interface Segregation Principle
 */
export const dashboardApi = {
  getStats: () => apiClient.get(API_ENDPOINTS.STATS),
  getTasks: () => apiClient.get(API_ENDPOINTS.TASKS),
  getProjects: () => apiClient.get(API_ENDPOINTS.PROJECTS),
  getProject: (id) => apiClient.get(API_ENDPOINTS.PROJECT_BY_ID(id)),
  createProject: (data) => apiClient.post(API_ENDPOINTS.PROJECTS, data),
  updateProject: (id, data) => apiClient.put(API_ENDPOINTS.PROJECT_BY_ID(id), data),
  deleteProject: (id) => apiClient.delete(API_ENDPOINTS.PROJECT_BY_ID(id)),
  getPerformance: () => apiClient.get(API_ENDPOINTS.PERFORMANCE),
  getSummary: () => apiClient.get(API_ENDPOINTS.SUMMARY),
  getDashboard: () => apiClient.get(API_ENDPOINTS.DASHBOARD),
  checkHealth: () => apiClient.get(API_ENDPOINTS.HEALTH),
};
