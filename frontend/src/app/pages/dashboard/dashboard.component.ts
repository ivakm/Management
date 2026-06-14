import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatChipsModule } from "@angular/material/chips";

import { ChartConfiguration, ChartType } from "chart.js";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardData } from "../../models/dashboard.model";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
  animations: [
    trigger("cardEnter", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("400ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
    trigger("staggerCards", [
      transition("* => *", [
        query(
          ":enter",
          [
            style({ opacity: 0, transform: "translateY(20px)" }),
            stagger("100ms", [
              animate("400ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("600ms ease-out", style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  dashboardData: DashboardData | null = null;

  // Revenue Chart
  revenueChartData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [
      {
        type: "line" as ChartType,
        data: [],
        label: "Revenue",
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#667eea",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  revenueChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Distribution Chart
  distributionChartData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#667eea", "#f093fb", "#4facfe"],
      },
    ],
  };

  distributionChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  displayedColumns: string[] = ["type", "customer", "amount", "date"];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getAllData().subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardData = response.data;
          this.updateCharts();
        }
      },
      error: (error) => {
        console.error("Error loading dashboard data:", error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private updateCharts(): void {
    if (!this.dashboardData) {
      return;
    }

    // Update revenue chart
    this.revenueChartData = {
      labels: this.dashboardData.monthlyRevenue.map((m) => m.month),
      datasets: [
        {
          type: "line" as ChartType,
          data: this.dashboardData.monthlyRevenue.map((m) => m.revenue),
          label: "Revenue",
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    };

    // Update distribution chart
    this.distributionChartData = {
      labels: this.dashboardData.customerDistribution.map((d) => d.status),
      datasets: [
        {
          data: this.dashboardData.customerDistribution.map((d) => d.count),
          backgroundColor: this.dashboardData.customerDistribution.map((d) => d.color),
        },
      ],
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case "purchase":
        return "shopping_cart";
      case "signup":
        return "person_add";
      case "update":
        return "edit";
      default:
        return "info";
    }
  }

  getActivityColor(type: string): string {
    switch (type) {
      case "purchase":
        return "primary";
      case "signup":
        return "accent";
      case "update":
        return "warn";
      default:
        return "";
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
