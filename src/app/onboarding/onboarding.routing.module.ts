import { Routes } from '@angular/router';
import { AddressComponent } from './individual/sow/sourceofwealth.component';
//import { ConfirmationComponent } from './confirmation screen/confirmation.component';
import { IndividualComponent } from './modals/progress-report.component';
import { ProfileEvaluatingComponent } from './modals/profile-evaluator-alert.component';
import { DesktopBranchComponent } from '../backoffice/onboarding/applicationsearch/applicationsearch.component';
import { IdentitydocumentComponent } from './individual/documents/document-uploader.component';
import { PersonalInfoComponent } from './individual/basic-info/basic-info.component';
import { CorporateDashboardComponent } from './corporate/dashboard/corporate-dashboard.component';
import { CompanyDocumentsComponent } from './corporate/documents/company-documents.component';
import { CompanyProfileComponent } from './corporate/profile/company-profile.component';
import { PdfPreviewComponent } from './individual/pdfpreview/pdf-preview/pdf-preview.component';
import { PreviewDocumentComponent } from '../backoffice/preview-document/preview-document/preview-document.component';
import { QrCorporateComponent } from './corporate/qr/qr-corporate.component';



export const ProfileRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'personalinfo/:applicationId',
                component: PersonalInfoComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'personalinfo/:customerId',
                component: PersonalInfoComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'personalinfo',
                component: PersonalInfoComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'address',
                component: AddressComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'address/:applicationId',
                component: AddressComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'documentUpload',
                component: IdentitydocumentComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'documentUpload/:applicationId',
                component: IdentitydocumentComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            // {
            //     path: 'confirmation',
            //     component: ConfirmationComponent,
            //     data: {
            //         title: 'Dashboard ',
            //         urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
            //     },
            // },
            {
                path: 'individualDashboard',
                component: IndividualComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'Application-Listings',
                component: DesktopBranchComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'Application-Listings/:status',
                component: DesktopBranchComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },

            {
                path: 'profile-evaluating',
                component: ProfileEvaluatingComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'corporate-dashboard',
                component: CorporateDashboardComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'corporate-documents',
                component: CompanyDocumentsComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'company-profile',
                component: CompanyProfileComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'corporate-documents/:id',
                component: CompanyDocumentsComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'company-profile/:id',
                component: CompanyProfileComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'preview/:id',
                component: PdfPreviewComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            }, 
            {
                path: 'preview',
                component: PdfPreviewComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            }, 
            {
                path: 'admin-preview',
                component: PreviewDocumentComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'admin-preview/:id',
                component: PreviewDocumentComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
            {
                path: 'qr',
                component: QrCorporateComponent,
                data: {
                    title: 'Dashboard ',
                    urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Dashboard ' }],
                },
            },
        ],
    },

];
