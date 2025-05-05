import axios from 'axios';

export async function apiRequest<T = any>(
    urlForRequest: string,
    method: 'get' | 'post' | 'put' | 'delete' = 'get',
    data?: any,
    token?: string,
    asForm = false, // <--- добавить этот флаг!
): Promise<T> {
    const url = `http://0.0.0.0:8000/api/${urlForRequest}`;
    try {
        let requestData = data;
        const headers: any = {
            Authorization: token ? `Bearer ${token}` : undefined,
        };
        if (asForm) {
            requestData = new URLSearchParams();
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    requestData.append(key, data[key]);
                }
            }
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
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
