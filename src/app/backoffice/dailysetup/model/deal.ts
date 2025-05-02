export class AddDeal{
    agentAccountNo !: string;
    initiatedBy !: string;
    sellerCurrencyCode !: string;
    buyerCurrencyCode !: string;
    buyerAmount !: string; 
    buyerExchangeRate !: string;
    handleBy !: string;
 
    constructor(obj?:any){
      this.agentAccountNo = obj && obj.agentAccountNo || "";
      this.initiatedBy = obj && obj.initiatedBy || "";
      this.sellerCurrencyCode = obj && obj.sellerCurrencyCode || "";
      this.buyerCurrencyCode = obj && obj.buyerCurrencyCode || "";
      this.buyerAmount = obj && obj.buyerAmount || "";
      this.buyerExchangeRate = obj && obj.buyerExchangeRate || "";
      this.handleBy = obj && obj.handleBy || "";
    }
}

export class RetrieveDeals{
  data !: GetDeals[];
}

export class GetDeals{
  DEALID !: string;
  INITIATEDBY !: string;
  AGENTACCTNUMBER !: string;
  SELLCURRENCY !: string;
  SELLAMOUNT !: string;
  SELLEXCHRATE !: string;
  BUYCURRENCY !: string;
  BUYAMOUNT !: string;
  BUYEXCHRATE !: string;
  DEALBALANCE !: string;
  DEALDATE !: string;
  DEALBY !: string;
}

export class AgentList{
  data!: Records[];

}

export class Records{
 
    ENTITYID !: string; 
    ENTITY !: string; 
    ENTITYNAME !: string;  

}