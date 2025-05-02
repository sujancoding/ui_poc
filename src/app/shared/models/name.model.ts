export class Name {
    givenName!: string;
    surName!: string;
    salutation!: string;

    constructor(givenName: string, surName: string, salutation: string) {
        this.givenName = givenName;
        this.surName = surName;
        this.salutation = salutation;
    }

}
