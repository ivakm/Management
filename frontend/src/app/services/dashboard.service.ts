import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import {
  DashboardStats,
  MonthlyRevenue,
  CustomerDistribution,
  RecentActivity,
  TopCustomer,
  DashboardData,
} from "../models";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getStats(): Observable<{ success: boolean; data: DashboardStats }> {
    return this.api.get<{ success: boolean; data: DashboardStats }>("/dashboard/stats");
  }

  getRevenue(): Observable<{ success: boolean; data: MonthlyRevenue[] }> {
    return this.api.get<{ success: boolean; data: MonthlyRevenue[] }>("/dashboard/revenue");
  }

  getDistribution(): Observable<{ success: boolean; data: CustomerDistribution[] }> {
    return this.api.get<{ success: boolean; data: CustomerDistribution[] }>(
      "/dashboard/distribution",
    );
  }

  getActivity(): Observable<{ success: boolean; data: RecentActivity[] }> {
    return this.api.get<{ success: boolean; data: RecentActivity[] }>("/dashboard/activity");
  }

  getTopCustomers(): Observable<{ success: boolean; data: TopCustomer[] }> {
    return this.api.get<{ success: boolean; data: TopCustomer[] }>("/dashboard/top-customers");
  }

  getAllData(): Observable<{ success: boolean; data: DashboardData }> {
    return this.api.get<{ success: boolean; data: DashboardData }>("/dashboard");
  }
}
