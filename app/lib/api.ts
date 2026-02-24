// API Client for FundiGuard Backend (Supabase Edge Functions)
const SUPABASE_URL = 'https://mbudwsejaucyauthctpo.supabase.co'
const API_URL = process.env.NEXT_PUBLIC_API_URL || SUPABASE_URL;

// Helper to construct Edge Function URLs
const getEdgeFunctionUrl = (functionName: string) => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:54321/functions/v1/${functionName}`
  }
  return `${API_URL}/functions/v1/${functionName}`
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        phone_number: string;
        full_name: string;
        role: 'client' | 'pro';
        created_at: string;
    };
}

export interface JobData {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    location: string;
    status: string;
    created_at: string;
}

export interface JobsResponse {
    jobs: JobData[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {},
    functionName?: string
): Promise<T> {
    // Determine which Edge Function to call
    const edgeFunc = functionName || endpoint.split('/')[1] || 'auth'
    const url = `${getEdgeFunctionUrl(edgeFunc)}`
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include', // Include cookies for production
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (e) {
                // Response is not JSON
            }
            throw new Error(errorMessage);
        }

        return response.json();
    } catch (error: any) {
        // Handle network/fetch errors
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            console.error('Network error - API unreachable:', url);
            throw new Error(
                `Unable to connect to server. Please check your internet connection. ` +
                `(Trying to reach: ${url})`
            );
        }
        throw error;
    }
}

export const api = {
    // Auth endpoints
    auth: {
        register: async (data: {
            phone_number: string;
            email: string;
            password: string;
            full_name: string;
            role: 'client' | 'pro';
        }) => apiCall<AuthResponse>('/auth', {
            method: 'POST',
            body: JSON.stringify({
                ...data,
                action: 'register'
            }),
        }, 'auth'),

        login: async (data: {
            phone_number: string;
            password: string;
        }) => apiCall<AuthResponse>('/auth', {
            method: 'POST',
            body: JSON.stringify({
                ...data,
                action: 'login'
            }),
        }, 'auth'),

        requestOTP: async (data: {
            phone_number: string;
            action: 'login' | 'register';
        }) => apiCall<{ message: string; debug?: string }>('/auth', {
            method: 'POST',
            body: JSON.stringify(data),
        }, 'auth'),

        verifyOTP: async (data: {
            phone_number: string;
            otp_code: string;
            action: 'login' | 'register';
            full_name?: string;
            email?: string;
            role?: 'client' | 'pro';
        }) => apiCall<AuthResponse>('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    // Jobs endpoints
    jobs: {
        list: async (token: string, page = 1, limit = 10) =>
            apiCall<JobsResponse>(`/jobs?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }, 'jobs'),

        create: async (token: string, data: {
            title: string;
            description: string;
            category: string;
            budget: number;
            location: string;
            urgency: string;
        }) => apiCall<JobData>('/jobs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }, 'jobs'),

        getById: async (token: string, jobId: string) =>
            apiCall<JobData>(`/jobs/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }, 'jobs'),
    },

    // Bids endpoints
    bids: {
        create: async (token: string, data: {
            job_id: string;
            proposed_price: number;
            timeline: number;
            proposal: string;
        }) => apiCall<any>('/bids', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }, 'bids'),

        getForJob: async (jobId: string) =>
            apiCall<any[]>(`/bids?job_id=${jobId}`, {
                method: 'GET',
            }, 'bids'),

        getMyBids: async (token: string) =>
            apiCall<any[]>('/bids', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }, 'bids'),

        accept: async (token: string, bidId: string) =>
            apiCall<any>(`/bids/${bidId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ action: 'accept' }),
            }, 'bids'),

        reject: async (token: string, bidId: string) =>
            apiCall<any>(`/bids/${bidId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ action: 'reject' }),
            }, 'bids'),
    },

    // Bookings endpoints
    bookings: {
        submitCompletion: async (token: string, bookingId: string, data: {
            completion_photos: string[];
            pro_notes?: string;
        }) => apiCall<any>(`/bookings/${bookingId}/completion`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }),
    },

    // Upload endpoints
    upload: {
        single: async (token: string, file: File) => {
            const formData = new FormData();
            formData.append('file', file);

            const url = `${API_URL}/api/upload`;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    let errorMessage = `Upload failed: ${response.status}`;
                    try {
                        const error = await response.json();
                        errorMessage = error.error || errorMessage;
                    } catch (e) {
                        // Response is not JSON
                    }
                    throw new Error(errorMessage);
                }

                return response.json() as Promise<{ url: string; path: string }>;
            } catch (error: any) {
                if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                    throw new Error('Unable to upload file. Please check your internet connection.');
                }
                throw error;
            }
        },

        batch: async (token: string, files: File[]) => {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const url = `${API_URL}/api/upload/batch`;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    let errorMessage = `Batch upload failed: ${response.status}`;
                    try {
                        const error = await response.json();
                        errorMessage = error.error || errorMessage;
                    } catch (e) {
                        // Response is not JSON
                    }
                    throw new Error(errorMessage);
                }

                return response.json() as Promise<{ urls: string[]; files: Array<{ url: string; path: string }> }>;
            } catch (error: any) {
                if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                    throw new Error('Unable to upload files. Please check your internet connection.');
                }
                throw error;
            }
        },

        delete: async (token: string, path: string) =>
            apiCall<{ message: string }>('/upload', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ path }),
            }),
    },

    // User endpoints
    users: {
        getProfile: async (token: string) =>
            apiCall<any>('/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
    },
};

// Storage helpers for auth token
export const auth = {
    setToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    },

    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    },

    removeToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    },

    setUser: (user: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    getUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    clearAuth: () => {
        auth.removeToken();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    },
};
