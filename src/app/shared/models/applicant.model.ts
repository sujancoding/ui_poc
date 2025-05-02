import { Name } from "./name.model";
import { Email } from "./email.model";
import { Phone } from "./phone.model";

export class Applicant {
    name!: Name;
    email!: Email[];
    phone!: Phone[];

    constructor(name: Name, email: Email[], phone: Phone[]) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}
