import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class URLHelperService {
    constructor() {
    }
    static getAPIBaseURL(): string {
        const host = window.location.host;
        let apibaseURL = "";
        switch(host) {
            case 'www.aptremit.com': {  //PROD APTREMIT
                apibaseURL = 'https://api.aptremit.com';
                break;
            }
            case 'aptremit.com': {  //PROD APTREMIT
                apibaseURL = 'https://api.aptremit.com';
                break;
            }
            case 'www.aptonline.com.sg': {  //PROD APTONLINE
                apibaseURL = 'https://api.aptonline.com.sg';
                break;
            }
            case 'aptonline.com.sg': {   //PROD APTONLINE
                apibaseURL = 'https://api.aptonline.com.sg';
                break;
            }
            case 'www.test.aptremit.com': { //UAT APTREMIT
                apibaseURL = 'https://apitest.aptremit.com';
                break;
            }
            case 'test.aptremit.com': {  //UAT APTREMIT
                apibaseURL = 'https://apitest.aptremit.com';
                break;
            }
            case 'www.test.aptonline.com.sg': { //UAT APTONLINE
                apibaseURL = 'https://apitest.aptonline.com.sg';
                break;
            }
            case 'test.aptonline.com.sg': { //UAT APTONLINE
                apibaseURL = 'https://apitest.aptonline.com.sg';
                break;
            }
            case 'www.test.remitany.com': {
                apibaseURL = 'https://apitest.remitany.com';
                break;
            }
            case 'test.remitany.com': {
                apibaseURL = 'https://apitest.remitany.com';
                break;
            }
            case 'localhost:4200': {
                apibaseURL = 'https://apitest.remitany.com';
                break;
            }
            default: {
                apibaseURL = 'https://api.aptremit.com';
                break;
            }
        }
        console.log("BASE URL ",apibaseURL);
        environment.apiBaseUrl = apibaseURL;
        return apibaseURL;
    }}