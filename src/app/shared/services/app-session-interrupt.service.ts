import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionInterruptService } from '../session-timeout/public.api';

@Injectable()
export class AppSessionInterruptService extends SessionInterruptService {
    constructor(private readonly httpClient: HttpClient) {
        super();
    }
    continueSession() {
        console.log(` API request to server.`);
    }
    stopSession() {
        console.log(` logout.`);
    }
    onExpire(): void {
        console.log(`Session expired`);
    }
}