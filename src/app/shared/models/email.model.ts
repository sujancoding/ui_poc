export class Email {
    emailAddress!: string;
    isPreferredEmail!: string;

    constructor(emailAddress: string, isPreferredEmail: string) {
        this.emailAddress = emailAddress;
        this.isPreferredEmail = isPreferredEmail;
    }
}

