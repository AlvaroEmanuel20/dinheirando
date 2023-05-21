import { apiInstance } from './apiInstance';

interface T3 {
  arg: any;
}

//SHARED SERVICES
export async function deleteService<T>(url: string) {
  return apiInstance.delete<T>(url).then((res) => res.data);
}

export async function createService<T1, T2 extends T3>(url: string, arg: T2) {
  return apiInstance.post<T1>(url, arg.arg).then((res) => res.data);
}

export async function updateService<T1, T2 extends T3>(url: string, arg: T2) {
  return apiInstance.patch<T1>(url, arg.arg).then((res) => res.data);
}
