import network from "./network";
// 登录注册相关
export const registerUser = (data: {}) => network.post('/register', data);
export const sendEmailCaptcha = (data: {}) => network.get('/emailCaptcha', data);
export const sendPhoneCaptcha = (data: {}) => network.get('/smsCaptcha', data);
export const loginUser = (data: {}) => network.post('/login', data);

//用户管理相关
export const getUsers = (data: any) => network.get('/api/v1/users', data);
export const createUsers = (data: {}) => network.post('/api/v1/users', data);
export const destroyUsers = (id: string) => network.delete(`/api/v1/users/${id}`);
export const updateUsers = (id: string, data: {}) => network.put(`/api/v1/users/${id}`, data);

// 角色管理相关
export const getRoles = (data:{}) => network.get('/api/v1/roles', data);
export const createRoles = (data:{})=> network.post('/api/v1/roles', data);
export const destroyRoles = (id:string)=> network.delete(`/api/v1/roles/${id}`);
export const updateRoles = (id:string, data:{})=> network.put(`/api/v1/roles/${id}`, data);

export const createUserRole = (data:{})=> network.post('/api/v1/userrole', data);
export const destroyUserRole = (userId: string, data:{})=> network.post(`/api/v1/userrole/${userId}`, data);

// 权限管理相关
export const getRights = (data:{})=>network.get('/api/v1/rights', data);
export const createRights = (data:{})=>network.post('/api/v1/rights', data);
export const destroyRights = (id:string)=>network.delete(`/api/v1/rights/${id}`);
export const updateRights = (id:string, data:{})=>network.put(`/api/v1/rights/${id}`, data);

// 分配角色相关
export const createRoleRights = (data:{})=>network.post('/api/v1/roleRights', data);
export const destroyRoleRights = (roleId:string, data:{})=>network.post(`/api/v1/roleRights/${roleId}`, data);
