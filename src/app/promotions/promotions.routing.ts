import { Routes } from '@angular/router';
import { AddPromotionComponent } from './add-promotion/add-promotion.component';
import { PromotionsComponent } from './promotions/promotions.component';



export const PromotionsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'promotion-maintenance',
                component: PromotionsComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'add-promotion',
                component: AddPromotionComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },


        ],
    },

];
