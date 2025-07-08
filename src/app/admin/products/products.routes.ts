import { Routes } from '@angular/router';

export const productsAdminRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./products/pages/products/products.component').then((m) => m.ProductsComponent)
    },
    {
        path: 'categories',
        loadComponent: () => import('./categories/pages/categories/categories.component').then((m) => m.CategoriesComponent)
    },
    {
        path: 'brands',
        loadComponent: () => import('./brands/pages/brands/brands.component').then((m) => m.BrandsComponent)
    },
    {
        path: 'attributes',
        loadComponent: () => import('./attributes/pages/attributes/attributes.component').then((m) => m.AttributesComponent)
    },
    {
        path: 'unique-products',
        loadComponent: () => import('./unique-products/pages/unique-product/unique-product.component').then((m) => m.UniqueProductComponent)
    }
];
