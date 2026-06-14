export interface DashboardStats {
  totalRevenue: number;
  newCustomers: number;
  activeUsers: number;
  conversionRate: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface CustomerDistribution {
  status: string;
  count: number;
  color: string;
}

export interface RecentActivity {
  id: number;
  type: "purchase" | "signup" | "update";
  customer: string;
  amount: number | null;
  date: string;
}

export interface TopCustomer {
  name: string;
  totalSpent: number;
  avatar: string;
}

export interface DashboardData {
  totalRevenue: number;
  newCustomers: number;
  activeUsers: number;
  conversionRate: number;
  monthlyRevenue: MonthlyRevenue[];
  customerDistribution: CustomerDistribution[];
  recentActivity: RecentActivity[];
  topCustomers: TopCustomer[];
}
