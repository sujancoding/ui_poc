import { Pipe, PipeTransform } from '@angular/core';
import { PromotionMaintenance } from 'src/app/promotions/models/PromotionsModel';
import { AddDeal, RetrieveDeals } from 'src/app/backoffice/dailysetup/model/deal';
import { ApplicationListings } from '../model/Application Search/application-search';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { Rates } from 'src/app/backoffice/exchangerates/model/exchangerate.model';


@Pipe({
  name: 'searchfilter',
  
 
})
export class SearchfilterPipe implements PipeTransform {

  transform(records: any, searchValue?: any): any {

    if(!records)return null;
    if(!searchValue)return records;

    searchValue = searchValue.toLowerCase();
    if(searchValue.length >= 3)

    return records.filter(function(item: any){
        return JSON.stringify(item).toLowerCase().includes(searchValue);
    
    });
  
}
  }

  @Pipe({
    name: 'searchAgent'
   
  })
  export class SearchAgentFilter implements PipeTransform {
  
    transform(records: any, searchValue?: any): any {
  
      if(!records)return null;
      if(!searchValue)return records;
  
      searchValue = searchValue.toLowerCase();
      if(searchValue.length >= 3)
  
      return records.filter(function(item: any){
          return JSON.stringify(item).toLowerCase().includes(searchValue);
      
      });
    
  }
    }

  @Pipe({
    name: 'searchCurrency'
   
  })
  export class SearchCurrencyPipe implements PipeTransform {
  
    transform(rates: any, searchValue?: any): any {
  
      if(!Rates)return null;
      if(!searchValue)return rates;
  
      searchValue = searchValue.toLowerCase();
      if(searchValue.length >= 1)
  
      return rates.filter(function(item: any){
          return JSON.stringify(item).toLowerCase().includes(searchValue);
      
      });
    
  }
    }


  @Pipe({
    name: 'searchCustomer'
   
  })
  export class SearchCustomerPipe implements PipeTransform {
  
    transform(customers: any, searchValue?: any): any {
  
      if(!customers)return null;
      if(!searchValue)return customers;
  
      searchValue = searchValue.toLowerCase();
      if(searchValue.length >= 3)
  
      return customers.filter(function(item: any){
          return JSON.stringify(item).toLowerCase().includes(searchValue);
      
      });
    
  }
    }

  

@Pipe({
  name:'filtercustomers'
})
export class FilterCustomers implements PipeTransform{
  transform() {

    // if(!activeCustomers || !searchName){
    //   return activeCustomers;
    // }
    // return activeCustomers.filter((activeCustomers) => activeCustomers.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()));
  }
  
}

@Pipe({
  name:'filterdescription'
})
export class filterdescription implements PipeTransform{
  transform(promotionMaintenance: PromotionMaintenance[] , searchDescription:string): PromotionMaintenance[] {

    if(!promotionMaintenance || !searchDescription){
      return promotionMaintenance;
    }
    return promotionMaintenance.filter((promotionMaintenance) => promotionMaintenance.Description.toLocaleLowerCase().includes(searchDescription.toLocaleLowerCase()));
  }
  
}

@Pipe({
  name:'filterAgent'
})
export class filterAgent implements PipeTransform{
  constructor(private store: InMemoryCache){}
  dealSummary : any;
  transform(deal: RetrieveDeals[], searchAgent?: any): any {
    if(!deal)return null;
    if(!searchAgent)return deal;

    searchAgent = searchAgent.toLowerCase();
    if(searchAgent.length >= 1)
      this.dealSummary = this.store.getItem('DealSummary');
    return this.dealSummary.filter(function(item: any){
        return JSON.stringify(item).toLowerCase().includes(searchAgent);
    
    });
  
}
}
@Pipe({
  name: 'filterNumber'
 
})
export class FilterNumber implements PipeTransform {

  transform(records: any, searchNumber?: any): any {

    if(!records)return null;
    if(!searchNumber)return records;

    searchNumber = searchNumber.toLowerCase();
    if(searchNumber.length >= 3)

    return records.filter(function(item: any){
        return JSON.stringify(item).toLowerCase().includes(searchNumber);
    
    });
  
}

  }

  @Pipe({
    name: 'filterCustomerNumber'
   
  })
  export class FilterCustomerNumber implements PipeTransform {
  
    transform(records: any, searchNumber?: any): any {
  
      if(!records)return null;
      if(!searchNumber)return records;
  
      searchNumber = searchNumber.toLowerCase();
      if(searchNumber.length >= 3)
  
      return records.filter(function(item: any){
          return JSON.stringify(item).toLowerCase().includes(searchNumber);
      
      });
    
  }
  
    }

  

@Pipe({
    name: 'filterAppType'
   
  })
  export class FilterApplicationType implements PipeTransform {
  
    transform(records: any, checkedValue?: any): any {
  
      if(!records)
      return null;
      if(!checkedValue)
      return records;
  
      if(checkedValue == "PENDING"){
      return records.filter(function(item: any){
          return item.STATUS == "PENDING"; 
  });
}
      else if(checkedValue == "NEW"){
       return records.filter(function(item: any){
        return item.STATUS == "NEW"; 
});
}
      else if(checkedValue == "REJECTED"){
       return records.filter(function(item: any){
       return item.STATUS == "REJECTED"; 
});
}
      else if(checkedValue == "ALL"){
       return records.filter(function(item: any){
       return item.STATUS == "ALL"; 
});
}
    
}
  
}

@Pipe({
  name: 'searchCustomerName'
 
})
export class SearchCustomerNamePipe implements PipeTransform {

  transform(customers: any, searchValue?: any): any {

    if(!customers)return null;
    if(!searchValue)return customers;

    searchValue = searchValue.toLowerCase();
    if(searchValue.length >= 1)

    return customers.filter(function(item: any){
        return JSON.stringify(item).toLowerCase().includes(searchValue);
    
    });
  console.log(customers)
 
}
  }

  @Pipe({
    name: 'searchUnpostedCustomer'
   
  })
  export class SearchUnPostedCustomerPipe implements PipeTransform {
  
    transform(customers: any, searchCustomer?: any): any {
  
      if(!customers)return null;
      if(!searchCustomer)return customers;
  
      searchCustomer = searchCustomer.toLowerCase();
      if(searchCustomer.length >= 3)
  
      return customers.filter(function(item: any){
          return JSON.stringify(item).toLowerCase().includes(searchCustomer);
      
      });
    
  }
    }

    @Pipe({
      name: 'searchPayee',
      
     
    })
    export class SearchPayeePipe implements PipeTransform {
    
      transform(records: any, searchValue?: any): any {
    
        if(!records)return null;
        if(!searchValue)return records;
    
        searchValue = searchValue.toLowerCase();
        if(searchValue.length >= 1)
    
        return records.filter(function(item: any){
            return JSON.stringify(item).toLowerCase().includes(searchValue);
        
        });
      
    }
      }

//MC => To transform customer type values from W -> Wholesale and R -> Retail
      @Pipe({
        name: 'counterTypeTransform'
      })
      export class CounterTypeTransformPipe implements PipeTransform {
      
        transform(value: string): string {
          if (value == 'W') {
            return 'WholeSale Counter';
          } else if (value == 'R') {
            return 'Retail Counter';
          } else {
            return 'Unknown';
          }
        }
      }     