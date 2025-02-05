import { apiClient } from '../constant/api';

class API {
    async handleRequest(request) {
        return request().catch((error) => {
            if (error.code === 'ECONNABORTED') {
                console.error('Request timed out');
            } else {
                console.error('An error occurred:', error.message);
            }
            throw error;
        });
    }

    async get(patch) {
        const response = await this.handleRequest(() => apiClient.get(patch));
        return response.data;
    }

    async post(patch, params) {
        const response = await this.handleRequest(() => apiClient.post(patch, params));
        return response.data;
    }

    async patch(patch, params) {
        const response = await this.handleRequest(() => apiClient.patch(patch, params));
        return response.data;
    }

    async delete(patch) {
        const response = await this.handleRequest(() => apiClient.delete(patch));
        return response.data;
    }

    async upload(file, nameForder) {
        const bodyFormData = new FormData();
        bodyFormData.append('fileUpload', file);
        const response = await apiClient.post('/files/upload', bodyFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                folder_type: nameForder
            }
        });
        return response.data;
    }
}

export default new API();
