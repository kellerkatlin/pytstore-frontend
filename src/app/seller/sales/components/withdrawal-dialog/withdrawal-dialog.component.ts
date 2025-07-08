import { Component, effect, inject, signal } from '@angular/core';
import { WithDrawalStore } from '../../services/withdrawal-store.service';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WithdrawalRequest } from '../../models/withdrawal.model';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommissionStore } from '../../services/commision-store.service';

@Component({
    selector: 'app-withdrawal-dialog',
    imports: [ButtonModule, Dialog, SkeletonModule, InputNumberModule, ReactiveFormsModule],
    templateUrl: './withdrawal-dialog.component.html'
})
export class WithdrawalDialogComponent {
    private readonly store = inject(WithDrawalStore);
    private readonly commissionStore = inject(CommissionStore);
    fb = inject(NonNullableFormBuilder);
    submitted = signal(false);

    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;

    myCommision = this.commissionStore.myCommission;

    form: FormGroup<{
        [key in keyof WithdrawalRequest]: FormControl<WithdrawalRequest[key]>;
    }> = this.fb.group({
        amount: this.fb.control<number>(0, [Validators.required, Validators.min(5)])
    });

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);
            this.form.reset();
        }
    });

    submit() {
        this.submitted.set(true);

        if (this.form.invalid) return;

        const dto = this.form.getRawValue();

        this.store.saveWithdrawal(dto);
    }

    setMaxAmount() {
        const availableAmount = this.myCommision()!;
        this.form.controls.amount.setValue(availableAmount.availableToWithdraw ?? 0);
    }

    close() {
        this.store.closeDialog();
    }
}
