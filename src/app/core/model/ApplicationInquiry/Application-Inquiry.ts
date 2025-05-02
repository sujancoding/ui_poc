import { Address, Demographics, SourceOfWealth } from "../Appication Update/Application_Update";


export class ApplicationInquiry {
    isApplicant!: string;
    applicationId!: string;
    status!: string;
    createdBy!: string;
    createdDate!: string;
    updatedBy!: string;
    updatedDate!: string;
    name!: Name;
    email!: EmailId;
    demographics!: Demographics;
    phone!: Phone;
    sourceOfWealth!: SourceOfWealth;
    address!: Address[];
    document!: Document[];

    constructor(Obj?:any){
        this.isApplicant = Obj && Obj.isApplicant || "";
        this.applicationId = Obj && Obj.applicationId || "";
        this.status = Obj && Obj.status || "";
        this.createdBy = Obj && Obj.createdBy || "";
        this.createdDate = Obj && Obj.createdDate || "";
        this.updatedBy = Obj && Obj.updatedBy || "";
        this.updatedDate = Obj && Obj.updatedDate || "";
        this.name = Obj && Obj.name || new Name();
        this.email = Obj && Obj.email || new EmailId();
        this.demographics = Obj && Obj.demographics || new Demographics();
        this.phone = Obj && Obj.phone || new Phone();
        this.sourceOfWealth = Obj && Obj.sourceOfWealth || new SourceOfWealth();
        this.address = Obj && Obj.address || new Address();
        this.document = Obj && Obj.document || new Document();
   
}
}

export class Name {
    name!: string;
}

export class EmailId{
    emailId!: string;
}

export class Phone{
    phoneNo	!:	string;
    phoneType!: string;
}

export class Document{
    docId!:	string;
    docTypeId!:	string;
    docName!:string;
    status!: string;
}