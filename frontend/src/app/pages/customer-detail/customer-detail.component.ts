import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { CustomerService } from "../../services";
import { Customer } from "../../models";

@Component({
  selector: "app-customer-detail",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: "./customer-detail.component.html",
  styleUrl: "./customer-detail.component.scss",
})
export class CustomerDetailComponent {
  customerForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<CustomerDetailComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { customer?: Customer },
  ) {
    this.isEditMode = !!data?.customer;
    this.customerForm = this.fb.group({
      name: [data?.customer?.name || "", [Validators.required, Validators.minLength(2)]],
      email: [data?.customer?.email || "", [Validators.required, Validators.email]],
      phone: [data?.customer?.phone || "", Validators.required],
      company: [data?.customer?.company || "", Validators.required],
      status: [data?.customer?.status || "pending", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.customerForm.value;

    const operation = this.isEditMode
      ? this.customerService.updateCustomer(this.data.customer!.id, formData)
      : this.customerService.createCustomer(formData);

    operation.subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open(
            this.isEditMode ? "Customer updated successfully" : "Customer created successfully",
            "Close",
            { duration: 3000 },
          );
          this.dialogRef.close(true);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(
          error.error?.message || `Failed to ${this.isEditMode ? "update" : "create"} customer`,
          "Close",
          { duration: 5000 },
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getNameError(): string {
    const name = this.customerForm.get("name");
    if (name?.hasError("required")) return "Name is required";
    if (name?.hasError("minlength")) return "Name must be at least 2 characters";
    return "";
  }

  getEmailError(): string {
    const email = this.customerForm.get("email");
    if (email?.hasError("required")) return "Email is required";
    if (email?.hasError("email")) return "Please enter a valid email";
    return "";
  }
}
