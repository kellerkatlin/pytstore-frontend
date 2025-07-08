import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TextareaModule } from 'primeng/textarea';
import { CapitalStore } from '../../service/capital-store.service';
import { CapitalAccountName, CapitalSourceType, CapitalType, CreateTransaction } from '../../models/capital.mode';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-transaction-dialog',
    imports: [Dialog, ButtonModule, SkeletonModule, TextareaModule, CalendarModule, SelectModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './transaction-dialog.component.html'
})
export class TransactionDialogComponent {
    private readonly store = inject(CapitalStore);
    fb = inject(NonNullableFormBuilder);
    submitted = signal(false);

    loadingDialog = this.store.loadingDialog;

    dialogOpen = this.store.dialogOpen;
    saving = this.store.saving;
    selectedBrand = this.store.selectedBrand;

    capitalTypes: { label: string; value: CapitalType }[] = [
        { label: 'Inyección de capital', value: 'INJECTION' },
        { label: 'Ganancia por venta', value: 'SALE_PROFIT' },
        { label: 'Gasto de compra', value: 'PURCHASE_EXPENSE' },
        { label: 'Gasto operativo', value: 'OPERATIONAL_EXPENSE' },
        { label: 'Costo devolución', value: 'DEVOLUTION_COST' },
        { label: 'Retiro de fondos', value: 'WITHDRAWAL' },
        { label: 'Transferencia entrante', value: 'TRANSFER_IN' },
        { label: 'Transferencia saliente', value: 'TRANSFER_OUT' }
    ];

    accountOptions: { label: string; value: CapitalAccountName }[] = [
        { label: 'Caja', value: 'CASH' },
        { label: 'Inventario', value: 'INVENTORY' },
        { label: 'Comisiones', value: 'COMMISSIONS' }
    ];

    referenceTypes: { label: string; value: CapitalSourceType }[] = [
        { label: 'Venta', value: 'SALE' },
        { label: 'Compra', value: 'PURCHASE' },
        { label: 'Devolución', value: 'RETURN' },
        { label: 'Envío', value: 'SHIPMENT' },
        { label: 'Gasto', value: 'EXPENSE' },
        { label: 'Retiro', value: 'WITHDRAWAL' },
        { label: 'Otro', value: 'OTHER' }
    ];

    form: FormGroup<{
        [key in keyof CreateTransaction]: FormControl<CreateTransaction[key]>;
    }> = this.fb.group({
        type: this.fb.control<CapitalType>('INJECTION', [Validators.required]),
        account: this.fb.control<CapitalAccountName>('CASH', [Validators.required]),
        amount: this.fb.control<number>(0, [Validators.required, Validators.min(1)]),
        createdAt: this.fb.control<Date>(new Date(), [Validators.required]),
        description: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
        referenceType: this.fb.control<CapitalSourceType>('OTHER', [Validators.required])
    });

    private readonly syncFormEffect = effect(() => {
        if (this.dialogOpen()) {
            this.submitted.set(false);
        }
    });

    submit() {
        this.submitted.set(true);

        if (this.form.invalid) return;

        const dto = this.form.getRawValue();

        this.store.saveTransaction(dto);
        this.form.reset();
    }

    close() {
        this.store.closeDialog();
        this.form.reset();
    }
}
