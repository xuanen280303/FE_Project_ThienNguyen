import { useRouter } from 'vue-router';
import { apiClient } from '../constant/api';

const router = useRouter();

class API {
    async handleRequest(request) {
        return request().catch((error) => {
            console.log(error.response?.status);
            if (error.response?.status === 403) {
                window.location.href = '/access';
            } else if (error.code === 'ECONNABORTED') {
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

    async upload(file, nameForder, isMany = false) {
        const bodyFormData = new FormData();
        if (isMany) {
            file.forEach((item) => {
                bodyFormData.append('fileUploads', item);
            });
        } else {
            bodyFormData.append('fileUpload', file);
        }
        const response = await apiClient.post(isMany ? '/files/upload-many' : '/files/upload', bodyFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                folder_type: nameForder,
                'X-Upload-Multiple': 'true'
            }
        });
        return response.data;
    }
}

export default new API();
