import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';


export const rootRouterConfig: Routes = [
  { 
    path: '', 
    redirectTo: 'shop',// 'home', 
    pathMatch: 'full' 
  },
 
  {
    path: '', 
    component: AuthLayoutComponent,
    children: [
     
    ]
  },
  {
    path: '', 
    component: AdminLayoutComponent,
    children: [
     
      {
        path: 'shop', 
        loadChildren: () => import('./views/shop/shop.module').then(m => m.ShopModule), 
        data: { title: 'Shop', breadcrumb: 'SHOP'}
      },
     
    ]
  },
  { 
    path: '**', 
    redirectTo: 'sessions/404'
  }
];

