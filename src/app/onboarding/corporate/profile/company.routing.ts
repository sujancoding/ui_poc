import { Routes } from "@angular/router";
import { CompanyAssociateComponent } from "../sow/company.associate.component";
import { CompanyDocumentsComponent } from "../documents/company-documents.component";
import { CompanyProfileComponent } from "./company-profile.component";


export const CompanyProfileRoutes : Routes = [
    {
    path: '',
    children: [
    {path: 'company-profile' , component: CompanyProfileComponent,
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
},
{path: 'company-associate' , component: CompanyAssociateComponent,
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
},
{path: 'company-documents' , component:CompanyDocumentsComponent,
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
},
{path: 'company-profile/:id' , component: CompanyProfileComponent,
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
},
{path: 'company-associate/:id' , component: CompanyAssociateComponent,
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
},
{path: 'company-documents/:id' , component:CompanyDocumentsComponent,
    data: {
        title: 'Dashboard ',
        urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
    },
},
]
    }
]