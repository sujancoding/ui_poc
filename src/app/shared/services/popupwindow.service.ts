import { Injectable } from '@angular/core';
import { InMemoryCache } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class WindowManagementService {
    private stockInventoryWindow: Window | null = null;
    private addTxnWindow : Window[] = []; // List to store all opened add transaction windows
    private addDealWindow : Window[] = [] ; // List to store all opened add deal windows .
    private displayRatesWindow : Window | null = null ;
    private dealListingsWindow : Window[] = [] ;
    private customerAccountsWindow : Window[]= [];
    counterType : string = '' ;
    counterTypeDescription : string = '' ;
    private rtDealListingWindow : Window | null = null;
    private rtContractListingWindow : Window | null = null;
    private rtCustomerSearchWindow : Window | null = null;
    private rtExchangeRateWindow : Window | null = null;

  constructor(private store: InMemoryCache) {

     // Listen for print requests from child windows
     window.addEventListener('child-print-request', (event: any) => {
      console.log('Print request received from child window');
      if (window.electronAPI) {
        window.electronAPI.silentPrint(event.detail.printContent);
        
        // Listen for print status and relay back to child
        window.electronAPI.onPrintStatus((response: any) => {
          if (event.detail.sourceWindow) {
            event.detail.sourceWindow.dispatchEvent(
              new CustomEvent('print-status', { 
                detail: response 
              })
            );
          }
        });
      }
    });
   }

  openStockInventoryWindow() {
    // If the window is already open, bring it to the front
    if (this.stockInventoryWindow && !this.stockInventoryWindow.closed) {
        this.stockInventoryWindow.focus();
        return;
    }
    
    let baseHref = window.location.origin;
    let path = "/#/popups-window/inventory";
    let url = baseHref + path;
    
    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 25; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    const width = (screenWidth * desiredWidthPercentage) / 100;

       // Calculate the left position to align the popup on the right side
    const left = screenWidth - width;  
    // Open the window and assign it to the variable
    this.stockInventoryWindow = window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,left=${left},width=${widthInPixels},height=850`);
    const stockInvetoryWindowRef = this.stockInventoryWindow ;
    if(stockInvetoryWindowRef){
      this.counterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";
      if(this.counterType == "W"){
        this.counterTypeDescription = "Wholesale"
      }
      else if(this.counterType == "R"){
        this.counterTypeDescription = "Retail"
      }
      else{
        this.counterTypeDescription = ""
      }
     // Use setTimeout to ensure the page loads before modifying the title
     setTimeout(() => {
      stockInvetoryWindowRef.document.title = `Cash Inventory ${this.counterTypeDescription}`;
  }, 1000); // Adjust delay if needed
    }

    // If the window is closed, reset the variable
    this.stockInventoryWindow?.addEventListener('beforeunload', () => {
      this.stockInventoryWindow = null;
    });
  }

  openAddTransactionWindow() {
    let baseHref = window.location.origin;
    let path = "/#/popups-window/new-transaction";
    let url = baseHref + path;
    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 70; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    const width = (screenWidth * desiredWidthPercentage) / 100;

        // Calculate center position
        // const left = (screenWidth - width) / 2;
        const screenHeight = window.screen.height;
        const height = screenHeight * 0.7;
        const top = screenHeight * 0.3;

    const addTxnReferenceWindow =  window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,width=${widthInPixels},height=${height},
    top=${top} `);
    if (addTxnReferenceWindow) {
      // Use setTimeout to ensure the page loads before modifying the title
      setTimeout(() => {
        addTxnReferenceWindow.document.title = "Add Transaction";
    }, 1000); // Adjust delay if needed
        this.addTxnWindow.push(addTxnReferenceWindow); // Push the opened window to the list
      }
  }

  //Open multiple 'Add Deals' window
  openAddDealWindow() {
    let baseHref = window.location.origin;
    let path = "/#/popups-window/add-deal";
    let url = baseHref + path;
    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 70; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    const width = (screenWidth * desiredWidthPercentage) / 100;

    const screenHeight = window.screen.height;
    const height = screenHeight * 0.7;
    const top = screenHeight * 0.3;

    const addDealReferenceWindow =  window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,width=${widthInPixels},height=${height}, top=${top}`);
    if (addDealReferenceWindow) {
        // Use setTimeout to ensure the page loads before modifying the title
        setTimeout(() => {
          addDealReferenceWindow.document.title = "Add Deal";
      }, 1000); // Adjust delay if needed
        this.addDealWindow.push(addDealReferenceWindow); // Push the opened window to the list
      }
  }

  //display Rates window
  openRatesWindow(){
      // If the window is already open, bring it to the front
      if (this.displayRatesWindow && !this.displayRatesWindow.closed) {
        this.displayRatesWindow.focus();
        return;
    }
    
    let baseHref = window.location.origin;
    let path = "/#/popups-window/display-rates";
    let url = baseHref + path;
    
    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 50; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    
    const width = (screenWidth * desiredWidthPercentage) / 100;

        // Calculate center position
        const left = (screenWidth - width) / 2;


    // Open the window and assign it to the variable
    this.displayRatesWindow = window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,left=${left},width=${widthInPixels},height=850`);
    
    // If the window is closed, reset the variable
    this.displayRatesWindow?.addEventListener('beforeunload', () => {
      this.displayRatesWindow = null;
    });
  }

  openDealListingWindow(){
    //write code here..
    let baseHref = window.location.origin;
    let path = "/#/popups-window/deal-listing";
    let url = baseHref + path;
    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 90; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    const width = (screenWidth * desiredWidthPercentage) / 100;

        // Calculate center position
        const left = (screenWidth - width) / 2;

    const dealListingReferenceWindow =  window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,left=${left},width=${widthInPixels},height=850`);
    if (dealListingReferenceWindow) {
        this.dealListingsWindow.push(dealListingReferenceWindow); // Push the opened window to the list
      }

  }

  openCustomerAccountsWindow(){
    let baseHref = window.location.origin;
    let path = "/#/popups-window/customer-accounts";
    let url = baseHref + path;
    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 90; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    const width = (screenWidth * desiredWidthPercentage) / 100;

        // Calculate center position
        const left = (screenWidth - width) / 2;

    const customerAccountsWindow =  window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,left=${left},width=${widthInPixels},height=850`);
    if (customerAccountsWindow) {
        this.customerAccountsWindow.push(customerAccountsWindow); // Push the opened window to the list
      }
  }
  
  closeAllWindow() {
   
    if (this.stockInventoryWindow && !this.stockInventoryWindow.closed) {
        this.stockInventoryWindow.close();
        this.stockInventoryWindow = null;
      }
      if (this.displayRatesWindow && !this.displayRatesWindow.closed) {
        this.displayRatesWindow.close();
        this.displayRatesWindow = null;
      }
      
       // Close all opened add transaction windows
    for (const addTxnReferenceWindow of this.addTxnWindow) {
        if (addTxnReferenceWindow && !addTxnReferenceWindow.closed) {
            addTxnReferenceWindow.close();
        }
      }

       // Close all opened add deal windows
    for (const addDealReferenceWindow of this.addDealWindow) {
      if (addDealReferenceWindow && !addDealReferenceWindow.closed) {
        addDealReferenceWindow.close();
      }
    }

    // close all opened deal list windows
    for (const dealListingReferenceWindow of this.dealListingsWindow) {
      if (dealListingReferenceWindow && !dealListingReferenceWindow.closed) {
        dealListingReferenceWindow.close();
      }
    }

    // close all opened customer accounts window
    for(const customerAccountsReferenceWindow of this.customerAccountsWindow){
      if(customerAccountsReferenceWindow && !customerAccountsReferenceWindow.closed){
        customerAccountsReferenceWindow.close();
      }
    }
    
    //close the RT Exch rate window
    if (this.rtExchangeRateWindow && !this.rtExchangeRateWindow.closed) {
      this.rtExchangeRateWindow.close();
      this.rtExchangeRateWindow = null;
    }

    // close RT Deal listing window
    if (this.rtDealListingWindow && !this.rtDealListingWindow.closed) {
      this.rtDealListingWindow.close();
      this.rtDealListingWindow = null;
    }

    //close RT Customer Search Window
    if (this.rtCustomerSearchWindow && !this.rtCustomerSearchWindow.closed) {
      this.rtCustomerSearchWindow.close();
      this.rtCustomerSearchWindow = null;
    }

     //close RT Contract Listing Window
     if (this.rtContractListingWindow && !this.rtContractListingWindow.closed) {
      this.rtContractListingWindow.close();
      this.rtContractListingWindow = null;
    }

    //write code here too --> close all windows once application is logout .

      // Reset window variables
      this.stockInventoryWindow = null;
      this.addTxnWindow = [];
      this.addDealWindow = [] ;
      this.displayRatesWindow = null ;
      this.dealListingsWindow = [] ;
      this.customerAccountsWindow = [];
  }

  //RT Shortcuts:

  //RT Exch Rate
  openRtExchangeRate() {
    //write code here..
    //1. no multiple windows should be supported (reference function -> openStockInventoryWindow() ) .
    //2. Position right , popup title name is "Exchange Rate Setup"
    if (this.rtExchangeRateWindow && !this.rtExchangeRateWindow.closed) {
      this.rtExchangeRateWindow.focus();
      return;
    }

    let baseHref = window.location.origin;
    let path = "/#/rt-popups-window/exchangerate-setup";
    let url = baseHref + path;

    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 85; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    const width = (screenWidth * desiredWidthPercentage) / 100;

    // Calculate center position
    const left = (screenWidth - width) / 2;

    // Open the window and assign it to the variable
    this.rtExchangeRateWindow = window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,left=${left},width=${widthInPixels},height=600`);

    const rtExchangeRateWindowRef = this.rtExchangeRateWindow;
    if (rtExchangeRateWindowRef) {
      // Use setTimeout to ensure the page loads before modifying the title
      setTimeout(() => {
        rtExchangeRateWindowRef.document.title = `Exchange Rate Setup`;
      }, 1000); // Adjust delay if needed
    }

    // If the window is closed, reset the variable
    this.rtExchangeRateWindow?.addEventListener('beforeunload', () => {
      this.rtExchangeRateWindow = null;
    });
  }

  //RT Deals
  openRtDeals() {
    //write code here..
    //1. no multiple windows should be supported (reference function -> openStockInventoryWindow() ) .
    //2. Position center , popup title name is "Book Deal"
    if (this.rtDealListingWindow && !this.rtDealListingWindow.closed) {
      this.rtDealListingWindow.focus();
      return;
    }

    let baseHref = window.location.origin;
    let path = "/#/rt-popups-window/book-deal";
    let url = baseHref + path;

    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 85; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    const width = (screenWidth * desiredWidthPercentage) / 100;

    // Calculate center position
    const left = (screenWidth - width) / 2;

    // Open the window and assign it to the variable
    this.rtDealListingWindow = window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,left=${left},width=${widthInPixels},height=600`);

    const rtDealListingWindowRef = this.rtDealListingWindow;
    if (rtDealListingWindowRef) {
      // Use setTimeout to ensure the page loads before modifying the title
      setTimeout(() => {
        rtDealListingWindowRef.document.title = `Book Deal`;
      }, 1000); // Adjust delay if needed
    }

    // If the window is closed, reset the variable
    this.rtDealListingWindow?.addEventListener('beforeunload', () => {
      this.rtDealListingWindow = null;
    });
  }

  //RT Contracts Listings
  openRtContractListing() {
    //write code here..
    //1. no multiple windows should be supported (reference function -> openStockInventoryWindow() ) .
    //2. Position center , popup title name is "Contract Listings"

    if (this.rtContractListingWindow && !this.rtContractListingWindow.closed) {
      this.rtContractListingWindow.focus();
      return;
    }

    let baseHref = window.location.origin;
    let path = "/#/rt-popups-window/contract-listing";
    let url = baseHref + path;

    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 85; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    const width = (screenWidth * desiredWidthPercentage) / 100;

    // Calculate center position
    const left = (screenWidth - width) / 2;

    // Open the window and assign it to the variable
    this.rtContractListingWindow = window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,left=${left},width=${widthInPixels},height=600`);

    const rtContractListingWindowRef = this.rtContractListingWindow;
    if (rtContractListingWindowRef) {
      // Use setTimeout to ensure the page loads before modifying the title
      setTimeout(() => {
        rtContractListingWindowRef.document.title = `Contract Listings`;
      }, 1000); // Adjust delay if needed
    }

    // If the window is closed, reset the variable
    this.rtContractListingWindow?.addEventListener('beforeunload', () => {
      this.rtContractListingWindow = null;
    });

  }

  //RT Customer search
  openRtCustomer() {
    //write code here..
    //1. no multiple windows should be supported (reference function -> openStockInventoryWindow() ) .
    //2. Position center , popup title name is "Customer"

    if (this.rtCustomerSearchWindow && !this.rtCustomerSearchWindow.closed) {
      this.rtCustomerSearchWindow.focus();
      return;
    }

    let baseHref = window.location.origin;
    let path = "/#/rt-popups-window/customer-search";
    let url = baseHref + path;

    // Calculate the width as a percentage of the screen width
    const screenWidth = window.screen.width;
    const desiredWidthPercentage = 85; // Set your desired width percentage here
    const widthInPixels = (screenWidth * desiredWidthPercentage) / 100;
    const width = (screenWidth * desiredWidthPercentage) / 100;

    // Calculate center position
    const left = (screenWidth - width) / 2;

    // Open the window and assign it to the variable
    this.rtCustomerSearchWindow = window.open(url, "_blank", `toolbar=yes,scrollbars=yes,resizable=yes,left=${left},width=${widthInPixels},height=600`);

    const rtCustomerSearchWindowRef = this.rtCustomerSearchWindow;
    if (rtCustomerSearchWindowRef) {
      // Use setTimeout to ensure the page loads before modifying the title
      setTimeout(() => {
        rtCustomerSearchWindowRef.document.title = `Customers`;
      }, 1000); // Adjust delay if needed
    }

    // If the window is closed, reset the variable
    this.rtCustomerSearchWindow?.addEventListener('beforeunload', () => {
      this.rtCustomerSearchWindow = null;
    });
  }
}
