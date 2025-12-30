import axios from 'axios';
import type {
    LoginFormData,
    AuthorityRegisterFormData,
    ApiResponse,
    Issue,
    CRIData,
    CurrentUser
} from '../types';

const api = axios.create({
    baseURL: '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Authentication APIs
export const authApi = {
    login: async (data: LoginFormData): Promise<ApiResponse> => {
        const response = await api.post('/api/login', {
            email: data.email,
            password: data.password
        });
        return response.data;
    },

    sendOtp: async (email: string): Promise<ApiResponse> => {
        const response = await api.post('/api/send_otp', { email });
        return response.data;
    },

    registerCitizen: async (data: { username: string; password: string; otp: string }): Promise<ApiResponse> => {
        const response = await api.post('/api/register_citizen', data);
        return response.data;
    },

    registerAuthority: async (data: AuthorityRegisterFormData): Promise<ApiResponse> => {
        const response = await api.post('/api/register/authority', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/api/logout');
    },

    getCurrentUser: async (): Promise<CurrentUser> => {
        try {
            const response = await api.get('/api/me');
            return response.data;
        } catch {
            return null;
        }
    },
};

// Issue APIs
export const issueApi = {
    submitReport: async (data: FormData): Promise<ApiResponse> => {
        const response = await api.post('/api/submit_report', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    getMyIssues: async (): Promise<Issue[]> => {
        const response = await api.get('/api/my_issues');
        return response.data;
    },

    getCommunityFeed: async (): Promise<Issue[]> => {
        const response = await api.get('/api/community_feed');
        return response.data;
    },

    getAuthorityIssues: async (): Promise<Issue[]> => {
        const response = await api.get('/api/authority_issues');
        return response.data;
    },

    updateStatus: async (issueId: number, status: string): Promise<ApiResponse> => {
        const response = await api.post('/api/update_status', { issue_id: issueId, status });
        return response.data;
    },
};

// CRI Map APIs
export const mapApi = {
    getCRIData: async (district: string): Promise<CRIData[]> => {
        const response = await api.get(`/api/get_cri_data/${district}`);
        return response.data;
    },
};

// Analytics APIs
export const analyticsApi = {
    getAnalytics: async (): Promise<any> => {
        const response = await api.get('/api/analytics');
        return response.data;
    },
};

export default api;
