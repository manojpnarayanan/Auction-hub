import API from "../axiosInstances";



export const createCategory=async (data:{name:string,description?:string})=>{
    const response=await API.post("/admin/categories",data);
    return response.data;
}
export const getCategories=async ()=>{
    const response=await API.get("/admin/categories");
    return response.data;
}
export const updateCategory=async (id:string,data:{name:string,description?:string})=>{
    const response=await API.put(`/admin/categories/${id}`,data);
    return response.data;
}
export const deleteCategory=async (id:string)=>{
    const response=await API.delete(`/admin/categories/${id}`);
    return response.data;
}