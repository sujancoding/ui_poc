export class ApplicationSteps {
   // id!: number;
    basicProfileFlag!: string;
    sourceOfIncomeFlag!: string;
    documentsFlag!: string;

    constructor(obj?: any){
     this.basicProfileFlag = obj && obj.basicProfileFlag || "N";
     this.sourceOfIncomeFlag = obj && obj.sourceOfIncomeFlag || "N";
     this.documentsFlag = obj && obj.documentsFlag || "N";
    }
};

//for corporate screens -> flag updation
export class CorporateApplicationSteps{
    companyProfileFlag !: string;
    companyAssociatesFlag  !: string;
    companyDocumentsFlag  !: string;
    constructor(obj?: any){
        this.companyProfileFlag = obj && obj.companyProfileFlag || "N";
        this.companyAssociatesFlag = obj && obj.companyAssociatesFlag || "N";
        this.companyDocumentsFlag = obj && obj.companyDocumentsFlag || "N";
       }
  }



//applicationSteps: {basicProfileFlag: 'Y', sourceOfIncomeFlag: 'N', documentsFlag: 'N'}