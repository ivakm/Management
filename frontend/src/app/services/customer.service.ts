import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Customer, PaginatedResponse, CustomerFormData } from "../models";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  constructor(private api: ApiService) {}

  getCustomers(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<Customer>> {
    let endpoint = "/customers?";
    if (params) {
      if (params.search) endpoint += `search=${encodeURIComponent(params.search)}&`;
      if (params.status) endpoint += `status=${params.status}&`;
      if (params.page) endpoint += `page=${params.page}&`;
      if (params.limit) endpoint += `limit=${params.limit}&`;
    }
    return this.api.get<PaginatedResponse<Customer>>(endpoint);
  }

  getCustomer(id: number): Observable<{ success: boolean; data: Customer }> {
    return this.api.get<{ success: boolean; data: Customer }>(`/customers/${id}`);
  }

  createCustomer(customer: CustomerFormData): Observable<{ success: boolean; data: Customer }> {
    return this.api.post<{ success: boolean; data: Customer }>("/customers", customer);
  }

  updateCustomer(
    id: number,
    customer: Partial<CustomerFormData>,
  ): Observable<{ success: boolean; data: Customer }> {
    return this.api.put<{ success: boolean; data: Customer }>(`/customers/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<{ success: boolean; message: string }> {
    return this.api.delete<{ success: boolean; message: string }>(`/customers/${id}`);
  }
}
