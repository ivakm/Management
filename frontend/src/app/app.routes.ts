import { Routes } from "@angular/router";
import { authGuard, guestGuard } from "./guards";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () => import("./pages/login").then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: "register",
    loadComponent: () => import("./pages/register").then((m) => m.RegisterComponent),
    canActivate: [guestGuard],
  },
  {
    path: "dashboard",
    loadComponent: () => import("./pages/dashboard").then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: "customers",
    loadComponent: () => import("./pages/customers").then((m) => m.CustomersComponent),
    canActivate: [authGuard],
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];
