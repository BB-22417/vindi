import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("vindi_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("vindi_token");
      localStorage.removeItem("vindi_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.message || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default api;

export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),
  socialLogin: (provider: string, token: string) =>
    api.post("/auth/social", { provider, token }),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data: any) => api.put("/auth/profile", data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
  deleteAccount: () => api.delete("/auth/account"),
};

export const trackingAPI = {
  getCheckIns: (params?: any) => api.get("/tracking/checkins", { params }),
  createCheckIn: (data: any) => api.post("/tracking/checkins", data),
  getCheckIn: (id: string) => api.get(`/tracking/checkins/${id}`),
  updateCheckIn: (id: string, data: any) => api.put(`/tracking/checkins/${id}`, data),
  deleteCheckIn: (id: string) => api.delete(`/tracking/checkins/${id}`),
  getTodayCheckIn: () => api.get("/tracking/checkins/today"),
};

export const insightsAPI = {
  getInsights: (params?: any) => api.get("/insights", { params }),
  getInsight: (id: string) => api.get(`/insights/${id}`),
  generateInsights: () => api.post("/insights/generate"),
  dismissInsight: (id: string) => api.put(`/insights/${id}/dismiss`),
};

export const analyticsAPI = {
  getAnalytics: (params?: any) => api.get("/analytics", { params }),
  getMoodTrend: (params?: any) => api.get("/analytics/mood-trend", { params }),
  getSleepTrend: (params?: any) => api.get("/analytics/sleep-trend", { params }),
  getSymptomTrend: (params?: any) => api.get("/analytics/symptom-trend", { params }),
  getCorrelation: (params?: any) => api.get("/analytics/correlation", { params }),
  getVindiScore: (params?: any) => api.get("/analytics/vindi-score", { params }),
  exportReport: (params?: any) => api.get("/analytics/export", { params, responseType: "blob" }),
};

export const interventionsAPI = {
  getInterventions: (params?: any) => api.get("/interventions", { params }),
  createIntervention: (data: any) => api.post("/interventions", data),
  updateIntervention: (id: string, data: any) =>
    api.put(`/interventions/${id}`, data),
  deleteIntervention: (id: string) => api.delete(`/interventions/${id}`),
  rateEffectiveness: (id: string, rating: number) =>
    api.put(`/interventions/${id}/rating`, { rating }),
};

export const communityAPI = {
  getPosts: (params?: any) => api.get("/community/posts", { params }),
  createPost: (data: any) => api.post("/community/posts", data),
  getPost: (id: string) => api.get(`/community/posts/${id}`),
  addComment: (postId: string, content: string) =>
    api.post(`/community/posts/${postId}/comments`, { content }),
  likePost: (postId: string) => api.post(`/community/posts/${postId}/like`),
  reportPost: (postId: string, reason: string) =>
    api.post(`/community/posts/${postId}/report`, { reason }),
};

export const subscriptionAPI = {
  getCurrentPlan: () => api.get("/subscription/current"),
  getPlans: () => api.get("/subscription/plans"),
  createCheckoutSession: (priceId: string) =>
    api.post("/subscription/create-checkout-session", { priceId }),
  createPortalSession: () => api.post("/subscription/create-portal-session"),
  cancelSubscription: () => api.post("/subscription/cancel"),
  getInvoices: () => api.get("/subscription/invoices"),
  getPaymentHistory: () => api.get("/subscription/payment-history"),
};

export const adminAPI = {
  getUsers: (params?: any) => api.get("/admin/users", { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getPlatformAnalytics: () => api.get("/admin/analytics"),
  getRevenueData: (params?: any) => api.get("/admin/revenue", { params }),
  getModerationQueue: () => api.get("/admin/moderation"),
  moderatePost: (postId: string, action: string) =>
    api.put(`/admin/moderation/${postId}`, { action }),
};

export const notificationsAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  updatePreferences: (data: any) =>
    api.put("/notifications/preferences", data),
};
