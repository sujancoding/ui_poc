export class AddDocument {
    id!: string;
    documentId!: string;
    documentName:string;
    documentData: string;
    applicationId : string ;
    applicantId : string ;
    
 
    constructor(obj?: any){
         this.id = obj && obj.id || "";
         this.documentId = obj && obj.documentId || "";
        this.documentName = obj && obj.documentName || "";
        this.documentData = obj && obj.documentData || "";
        this.applicationId = obj && obj.applicationId || "";
        this.applicantId = obj && obj.applicantId || "";
    }



} 

export class CorporateAddDocument {
    documentId!: string;
    documentName :string;
    documentData: string;
    applicationId : string ;
    applicantId : string ;
    associateId : string ;
    
 
    constructor(obj?: any){
        this.associateId = obj && obj.associateId || "";
         this.documentId = obj && obj.documentId || "";
        this.documentName = obj && obj.documentName || "";
        this.documentData = obj && obj.documentData || "";
        this.applicationId = obj && obj.applicationId || "";
        this.applicantId = obj && obj.applicantId || "";
    }



} 

export class AddTransactionScreeningDocument {
    transactionId!: string;
    docTypeId!: string;
    documentName:string;
    documentData: string;
    
    constructor(obj?: any){
         this.transactionId = obj && obj.transactionId || "";
         this.docTypeId = obj && obj.docTypeId || "";
        this.documentName = obj && obj.documentName || "";
        this.documentData = obj && obj.documentData || "";
    }



}

export const DOCUMENT_ID_MAPPER: any ={

    //key           : 'value'
    NRIC_FRONT_IMAGE: '1001',
    NRIC_BACK_IMAGE:'1002' ,
    OTHER_NRIC_FRONT: '1003',
    OTHER_NRIC_BACK: '1004',
    ADDRESS_PROOF: '1005',
    PAYSLIP: '1006',
    ONBOARDING_DOCUMENT : '1007'
};
//DOCUMENT_ID_MAPPER is a object here and NRIC_FRONT_IMAGE is key and '1001' is value  
export function getDocumentKeyByValue(value: string) {
    return Object.keys(DOCUMENT_ID_MAPPER).find(key => DOCUMENT_ID_MAPPER[key] == value);

}

export const CORPORATE_DOCUMENT_ID_MAPPER: any ={

    //key           : 'value'
    ACRA: '1005',
    OWNER_NRIC:'1006' ,
    DEALER_NRIC: '1007',
    RUNNER_NRIC: '1008',
    INCORPORATION_CERTIFICATE : '1009' ,
    ARTICLES_ASSOCIATION : '1010' ,
    BANK_LICENSE : '1011',
    TRADE_LICENSE : '1012' ,
    AML_POLICY_AND_PROCEDURES : '1013' ,
    AUDIT_REPORT : '1014' ,
    LATEST_AML_AUDIT_REPORT : '1015' ,
    LATEST_ORGANISATION_STRUCTURE : '1016' ,
    MANAGEMENT_LIST : '1017' ,
    ID_COPIES : '1018' ,
    KYC_FORM : '1019' ,
    WOLFSBERG_FORM : '1020',
    ONBOARDING_DOCUMENT : '1021'


};
//DOCUMENT_ID_MAPPER is a object here and NRIC_FRONT_IMAGE is key and '1001' is value  
export function fetchDocumentKeyByValue(value: string) {
    return Object.keys(CORPORATE_DOCUMENT_ID_MAPPER).find(key => CORPORATE_DOCUMENT_ID_MAPPER[key] == value);

}

export const TRANSACTION_SCREENING_DOCUMENT_ID_MAPPER: any ={

    //key           : 'value'
    DEPOSITED_SLIP : '2001',
    TXN_SCREENING_DOC_1: '2002',
    TXN_SCREENING_DOC_2:'2003' ,
    TXN_SCREENING_DOC_3: '2004',
};

export function fetchScreeningDocumentKeyByValue(value: string) {
    return Object.keys(TRANSACTION_SCREENING_DOCUMENT_ID_MAPPER).find(key => TRANSACTION_SCREENING_DOCUMENT_ID_MAPPER[key] == value);

}

//12 NEW DOCUMENTS :
// 1.        Incorporation Certificate
// 2.        Articles/Association .
// 3.        Bank License 
// 4.        Trade License 
// 5.        AML Policy & Procedures
// 6.        Audit Report
// 7.        Latest AML Audit Report
// 8.        Latest organization structure
// 9.        Management List
// 10.        ID copies
// 11.        KYC form 
// 12.        Wolfsberg form