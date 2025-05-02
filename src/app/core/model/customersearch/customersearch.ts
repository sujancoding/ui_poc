export class CustomerSearch{
    data !: CustomerList[];
}

export class CustomerList{
    CUSTOMERID !: string;
    NAME !: string;
    STATUS !: string;
    CUSTOMERTYPE !: string;
    PHONENBR !: string;
    NATIONALITY !: string;
}

export class CustomerStatusUpdate {
    remarks !: string;

    constructor(obj?:any){
     this.remarks = obj && obj.remarks || "" ;
    }
}