import { initiatedBy } from "./dropdownvalues";


    //INITIATED = "1";
    // AMOUNT RECEIVED = "2";
    // APPROVED = "3";
    // PAYMENT RECEIVED = "4"; 
    // PENDING = "5";
    // ACKNOWLEDGED = "6";
    // DEPOSITED = "7";
    // FAILED AT BANK = "8";
    // BANK COMPLETED = "9"; 
    // BANK APPROVED = "10";
    // BANK REQUEST RECEIVED = "11";
    // BANK COMPLETE WITH CHANGE = "12";
    // CANCELLED = "20"


//STATUS color diff
 export function getColor(value: any) {
    switch (value) {
      case 'INITIATED':
        return '#FF5E3A';
      case 'DEPOSITED':
        return 'rgb(104 104 104)';
      case 'APPROVED':
        return '#14804A';
      case 'ACKNOWLEDGED':
        return '#3E8DA6';
      case 'AMOUNT RECEIVED':
        return '#AA5B00'
      case 'PENDING':
        return '#83349F'
       case 'PAYMENT RECEIVED':
        return '#129D57' 
      case 'FAILED AT BANK':
        return '#FB5B5B'
       case 'BANK COMPLETED':
         return '#14804A'  
      case 'BANK APPROVED':
        return 'rgb(33 129 203)'
      case 'BANK COMPLETE WITH CHANGE':
        return '#14804A'
      case 'CANCELLED':
        return '#D32E38'
      case 'BANK REQUEST RECEIVED':
        return '#AA5B00'
        case 'SUCCESSFUL':
        return '#14804A'  
       case 'FAILED':
        return '#FB5B5B'
        case 'CANCELED':
          return '#D32E38'
      default:
        return '';
    }
  }
  //bg color for status tags .
  export function getBackgroundColor(status: string): string {
    switch (status) {
      case 'INITIATED':
        return '#F3F3F3';
      case 'DEPOSITED':
        return 'rgb(242 242 242)';
      case 'APPROVED':
        return '#E1FCEF';
      case 'ACKNOWLEDGED':
        return '#FFFCE0';
      case 'AMOUNT RECEIVED':
        return '#FCF2E6'
      case 'PENDING':
        return '#FFECFF'
      case 'PAYMENT RECEIVED':
        return '#EAEAEA' 
      case 'FAILED AT BANK':
        return '#FFEDDF'
       case 'BANK COMPLETED':
        return '#E1FCEF' 
      case 'BANK APPROVED':
        return 'rgb(224 243 255)'
      case 'BANK COMPLETE WITH CHANGE':
        return '#E1FCEF'
      case 'CANCELLED':
        return '#ECECEC'
      case 'BANK REQUEST RECEIVED':
        return '#FCF2E6'
        case 'SUCCESSFUL':
          return '#E1FCEF'
          case 'FAILED':
            return '#FFEDDF'
            case 'CANCELED':
              return '#ECECEC'
      default:
        return '';
    }

  }

  //Shipment search > status font color 
  export function getShipmentColor(value: any) {
    switch (value) {
    case 'INITIATED':
      return '#FF5E3A';
      case 'IN-FLIGHT':
      return 'rgb(33 129 203)'
      case 'DELIVERED':
      return '#14804A'
      case 'CANCELLED':
      return '#D32E38'
      default:
        return '';
    }
  }

  //Shipment search > status font bg color 
  export function getShipmentBgColor(value: any) {
    switch (value) {
    case 'INITIATED':
      return '#F3F3F3';
      case 'IN-FLIGHT':
       return 'rgb(224 243 255)'
        case 'DELIVERED':
        return '#E1FCEF'
        case 'CANCELLED':
        return '#ECECEC'
      default:
        return '';
    }
  }

  //tool tip text value based on txnstatus ..
  export function getShipmentTooltipText(status: string): string {
    switch (status) {

      case 'INITIATED':
      return 'Shipment is Initiated';
      case 'IN-FLIGHT':
        return 'Shipment in-flight';
        case 'DELIVERED':
        return 'Shipment delivered to customer'
        case 'CANCELLED':
        return 'Shipment Cancelled'
      default:
        return ''; // Empty string as default tooltip text
    }
  }

    //tool tip text value based on txnstatus ..
    export function getTooltipText(status: string): string {
      switch (status) {
        case 'INITIATED':
          return 'Payment not initiated';
  
        case 'AMOUNT RECEIVED':
          return 'Payment initiated successfully';
  
        case 'APPROVED':
          return `${initiatedBy} approved this transaction`;
  
         case 'PAYMENT RECEIVED' :
          return 'Payment received' ; 
  
        case 'PENDING':
          return 'Pending from Bank';
  
        case 'ACKNOWLEDGED':
          return 'Agent acknowledged';
  
        case 'DEPOSITED':
          return 'Agent deposited the amount to payee';
  
        case 'FAILED AT BANK':
          return 'Bank declined this transaction';
  
        case 'BANK COMPLETED' :
         return 'Bank deposits the amount to payee' ; 
  
        case 'BANK APPROVED':
          return 'Bank approved the transaction';
  
        case 'BANK REQUEST RECEIVED':
          return 'Bank received the transaction request';
  
        case 'BANK COMPLETE WITH CHANGE':
          return 'Bank deposits the amount to payee';
  
        case 'CANCELLED':
          return 'Transaction is cancelled';
        default:
          return ''; // Empty string as default tooltip text
      }
    }
  
    //Contract color
    export function getContractColor(status:string) {
      switch (status) {
        case 'ACTIVE' :  //OPEN changed to ACTIVE  
        return 'rgb(30 189 40)'; 
    
          case 'CLOSED' :    
          return'black';
    
          case 'EXPIRED' :    
          return 'red'
    
          case 'ENDS TODAY' :    
          return '#FF5E3A';
        default:
          return '';
      }
    }

  //Contract Bg color
    export function getContractBgcolor(status:string) {
      switch (status) {
        case 'ACTIVE' :  //OPEN changed to ACTIVE  
        return '#E1FCEF'; 
    
        case 'CLOSED' :    
        return'#e1e1e1';
    
        case 'EXPIRED' :    
        return '#FFEDDF'
    
        case 'ENDS TODAY' :    
        return '#F3F3F3';
        default:
          return '';
      }
    }

    // Contract Tooltip Text
    export function getContractTooltiptext(status:string) {
      switch (status) {
        case 'ACTIVE' :  //OPEN changed to ACTIVE  
        return'Open Contract';
    
        case 'CLOSED' :    
        return'Contract is Completed';
    
        case 'EXPIRED' :    
        return'Contract is Expired';
    
        case 'ENDS TODAY' :    
        return'Contract will ends by today';
      
        default:
          return ''; // Empty string as default tooltip text
      }
    }
    
//STATUS color diff Active and Inactive 
export function statusColor(status: any) {
  switch (status) {

    case 'Active':
      return 'rgb(30 189 40)';

    case 'InActive':
      return 'red'

    default:
      return '';
  }
}
//bg color for status Active and Inactive 
export function statusBgColor(status: any) {
  switch (status) {
    case 'Active':
      return '#E1FCEF'; 
    case 'InActive':
      return '#FFEDDF'
      
    default:
      return '';
  }
  
}

//tooltip text for role
export function getRoleTooltiptext(status: any) {
  switch (status) {
    case 'Active' :
      return 'Active Role' ;

    case 'InActive':
      return 'Deactivated Role';

  
    default:
      return ''; // Empty string as default tooltip text
  }
}
//tooltip text for staff
export function getStaffTooltipText (status:any){
  switch (status) {
    case 'Active' :
      return "Active Staff's" ;

    case 'InActive':
      return "Deactivated Staff's";

  
    default:
      return ''; // Empty string as default tooltip text
  }
}
//tooltip text for agent
export function getAgentTooltipText(status:any){
  switch (status) {
    case 'Active' :
      return 'Active Agent' ;

    case 'InActive':
      return 'Deactivated Agent';

  
    default:
      return ''; // Empty string as default tooltip text
  }
}
//color for stepper
export function getStepperColor(status:string){
  switch (status) {
    case 'In Progress':
      return '#1976D2'
    case 'Pending':
      return '#BDBDBD'
    case 'Completed':
      return '#20C374'
    case 'Active':
      return 'rgb(30 189 40)';
    case 'InActive':
      return 'red'
    default: return ''


  }
}
//bg-color for stepper
export function getStepperBgColor(status:string){
  switch (status) {
    case 'In Progress':
      return '#F6F4FD'
    case 'Pending':
      return '#FFFFFF'
    case 'Completed':
      return '#E6FBF1'
    case 'Active':
      return '#E1FCEF';
    case 'InActive':
      return '#FFEDDF'
    default: return ''

  }
}
export function getCustomerTooltipText(status:string){
  switch (status) {
    case 'Active' :
      return 'Active Customers' ;

    case 'InActive':
      return 'Deactivated Customers';

  
    default:
      return ''; // Empty string as default tooltip text
  }
}

export function getApplicantStatusColor(status:string){
  switch (status) {
    case 'PENDING':
      return '#ff9334'; 
    case 'NEW':
      return '#FF5E3A';
      case 'REJECTED':
        return 'red'
        case 'APPROVED':
          return 'rgb(30 189 40)'; 
          // added for status active
          case 'ACTIVE':
            return 'rgb(30 189 40)';
    default:
      return '';
  }
}
export function getApplicantStatusBgColor(status:string){
  switch (status) {
    case 'PENDING':
      return '#FFF8E1'; 
    case 'NEW':
      return '#F3F3F3';
      case 'REJECTED':
        return '#FFEDDF'
        case 'APPROVED':
          return '#E1FCEF'; 
          // added for status active
          case 'ACTIVE':
            return '#E1FCEF '
    default:
      return '';
  }
}

export function getApplicantTooltipText(status:string){
  switch (status) {
    case 'PENDING' :
      return 'Pending for Approval' ;
    case 'NEW':
      return 'Draft Application';
      case 'REJECTED':
        return 'Rejected Application';
        case 'APPROVED':
          return 'Approved Customer';
  
    default:
      return ''; // Empty string as default tooltip text
  }
}
export function getPayeeTooltipText(status:string){
  switch (status) {
    case 'PENDING' :
      return 'Pending for Approval' ;

      case 'ACTIVE' :
      return 'Approved Payee' ;
      
      case 'REJECTED' :
      return 'Rejected Payee' ;

    default:
      return ''; // Empty string as default tooltip text
  }
}


export function getTxnStatusAndColor(status: string): { color: string, bgcolor: string, tooltipText: string , status :string } {
  let result = { color: '', bgcolor: '', tooltipText: '',status : '' };

  switch (status) {
    case 'INITIATED':
      result.color = '#FF5E3A';
      result.bgcolor = '#F3F3F3';
      result.tooltipText = '';
      result.status = 'Payment due'
      break;

    case 'DEPOSITED':
      result.color = '#14804A';
      result.bgcolor = '#E1FCEF';
      result.tooltipText = '';
      result.status = 'Successful'
      break;

    case 'APPROVED':
      result.color = '#FF5E3A';
      result.bgcolor = '#F3F3F3';
      result.tooltipText = '';
      result.status = 'In-Progress'
      break;

    case 'ACKNOWLEDGED':
      result.color = '#FF5E3A';
      result.bgcolor = '#F3F3F3';
      result.tooltipText = '';
      result.status = 'In-Progress'
      break;

    case 'AMOUNT RECEIVED':
      result.color = '#FF5E3A';
      result.bgcolor = '#F3F3F3';
      result.tooltipText = '';
      result.status = 'In-Progress'
      break;

    case 'PENDING':
      result.color = '#FF5E3A';
      result.bgcolor = '#F3F3F3';
      result.tooltipText = '';
      result.status = 'In-Progress'
      break;

    case 'PAYMENT RECEIVED':
      result.color = '#FF5E3A';
      result.bgcolor = '#F3F3F3';
      result.tooltipText = '';
      result.status = 'In-Progress'
      break;

    case 'FAILED AT BANK':
      result.color = '#FB5B5B';
      result.bgcolor = '#FFEDDF';
      result.tooltipText = '';
      result.status = 'Failed'
      break;

    case 'BANK COMPLETED':
      result.color = '#14804A';
      result.bgcolor = '#E1FCEF';
      result.tooltipText = '';
      result.status = 'Successful'
      break;

    case 'BANK APPROVED':
      result.color = '#14804A';
      result.bgcolor = '#E1FCEF';
      result.tooltipText = '';
      result.status = 'Successful'
      break;

    case 'BANK COMPLETE WITH CHANGE':
      result.color = '#14804A';
      result.bgcolor = '#E1FCEF';
      result.tooltipText = '';
      result.status = 'Successful'
      break;

    case 'CANCELLED':
      result.color = '#D32E38';
      result.bgcolor = '#ECECEC';
      result.tooltipText = '';
      result.status = 'Cancelled'
      break;

    case 'BANK REQUEST RECEIVED':
      result.color = '#FF5E3A';
      result.bgcolor = '#F3F3F3';
      result.tooltipText = '';
      result.status = 'In-Progress'
      break;

    default:
      result.color = '';
      result.bgcolor = '';
      result.tooltipText = '';
      result.status = ''
  }

  return result;
}

export function getPayeeStatusColor(status:string){
  switch(status) {
    case 'ACTIVE' :
      return'#afdec3';

      case 'PENDING' :
      return'#f1b179';

      case 'REJECTED':
        return 'red'

        case 'INACTIVE':
      return '#FFEDDF'

  }
}
export function getPayeeTextColor(status:string){
  switch(status) {
      case 'REJECTED':
        return 'white'
        default:
          return 'black';
  }
}


  //MC Deal color
  export function getDealColorMoneyChanger(status:string) {
    switch (status) {
      case 'OPEN' :  //OPEN changed to ACTIVE  
      return 'rgb(30 189 40)'; 

      case 'REALISED' :  //OPEN changed to ACTIVE  
      return 'rgb(30 189 40)'; 
  
        case 'CLOSED' :    
        return'black';
  
        case 'CANCELLED' :    
        return 'red'

        case 'DELETED' :    
        return 'red'
  
        case 'PARTIAL' :    
        return '#FF5E3A';
      default:
        return '';
    }
  }

//MC deal Bg color
  export function getDealBgcolorMoneyChanger(status:string) {
    switch (status) {
      case 'OPEN' :  
      return '#E1FCEF'; 

      case 'REALISED' :  //OPEN changed to ACTIVE  
      return '#E1FCEF'; 
  
      case 'CLOSED' :    
      return'#e1e1e1';
  
      case 'CANCELLED' :    
      return '#FFEDDF'

      case 'DELETED' :    
      return '#FFEDDF'
  
      case 'PARTIAL' :    
      return '#F3F3F3';
      default:
        return '';
    }
  }


  //MC Deal color
  export function getTransactionColorMoneyChanger(status:string) {
    switch (status) {
      case 'INITIATED' :  
      return '#14804A';

      case 'CANCELLED' : 
      return '#FB5B5B'

      default:
        return '';
    }
  }

//MC deal Bg color
  export function getTransactionBgcolorMoneyChanger(status:string) {
    switch (status) {
      case 'INITIATED' :  
      return '#E1FCEF';

      case 'CANCELLED' :    
      return '#FFEDDF'
  
      default:
        return '';
    }
  }

 