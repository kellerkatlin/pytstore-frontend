import { Directive, input, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { RoleName } from '../../auth/models/user.interface';
import { AuthService } from '../../auth/service/auth.service';

@Directive({
    selector: '[hasRole]'
})
export class HasRoleDirective {
    private roles: RoleName[] = [];

    constructor(
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainer: ViewContainerRef,
        private readonly authService: AuthService
    ) {}
    @Input()
    set hasRole(roles: RoleName[]) {
        this.roles = roles;

        const user = this.authService.currentUser;
        if (user && roles.includes(user.role as RoleName)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
