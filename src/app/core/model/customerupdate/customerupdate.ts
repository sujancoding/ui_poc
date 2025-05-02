export class CustomerUpdate {
    customerType!: string;
    email!: Email[];
    phone !: Phone[];
    address!: Address[];
}


export class Email{
    emailAddress !: string;
    isPreferredEmail !: string;
}

export class Phone{
    phoneType !: string;
    phoneNumber !: string;
    phoneCountryCode !: string;
}

export class Address{
    isprimary !: string;
    level !: string;
    unit !: string;
    block !: string;
    streetName !: string;
    city !: string;
    state !: string;
    country	!: string;
    postalCode !: string;
    address !: string;
}

export class EmailAddress {
    emailAddress !: string ;

    constructor(obj?:any){
        this.emailAddress = obj && obj.emailAddress || ""; 
    }

}