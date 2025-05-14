import axios from 'axios';

// Присвоим базовый URL из env, либо дефолт если не определен
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://127.0.0.1:8000/api'; // Default fallback

export async function apiRequest<T = any>(
    urlForRequest: string,
    method: 'get' | 'post' | 'put' | 'delete' = 'get',
    data?: any,
    token?: string,
    asForm = false,
): Promise<T> {
    const url = `${API_BASE_URL.replace(/\/$/, '')}/${urlForRequest.replace(/^\//, '')}`;

    try {
        let requestData = data;
        const headers: Record<string, string> = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (asForm) {
            const form = new URLSearchParams();
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    form.append(key, data[key]);
                }
            }
            requestData = form.toString(); // Важно!
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else if (data !== undefined) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await axios({
            url,
            method,
            data: requestData,
            headers,
        });

        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
}
