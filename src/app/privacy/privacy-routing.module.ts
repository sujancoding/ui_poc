import { Routes } from '@angular/router';
import { PrivacyPolicyContentComponent } from './privacy-policy-content/privacy-policy-content.component';


export const privacyRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'policy',
                component: PrivacyPolicyContentComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
          ]
          }

];
