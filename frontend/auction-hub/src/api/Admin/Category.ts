import API from "../axiosInstances";



export const createCategory = async (data: { name: string, description?: string }) => {
    const response = await API.post("/admin/categories", data);
    return response.data;
}
export const getCategories = async (page: number = 1, limit: number = 5,searchTerm:string) => {
    const response = await API.get(`/admin/categories?&page=${page}&limit=${limit}&searchTerm=${searchTerm}`);
    return response.data.data;
}
export const updateCategory = async (id: string, data: { name: string, description?: string }) => {
    const response = await API.put(`/admin/categories/${id}`, data);
    return response.data;
}
export const deleteCategory = async (id: string) => {
    const response = await API.delete(`/admin/categories/${id}`);
    return response.data;
}