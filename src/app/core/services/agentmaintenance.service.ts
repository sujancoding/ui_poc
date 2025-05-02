import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AddAgent, AddAgentDocument, AgentMarginTierUpdate, AgentUpdate } from "src/app/backoffice/agentmaintenance/models/agent.model";
import { GlobalConstants } from "src/app/shared/global.constant";
import { InMemoryCache } from "src/app/shared/services/cache.service";

@Injectable({
    providedIn: 'root'
  })
  export class AgentMaintenanceService {
  
    constructor(private http : HttpClient,private store : InMemoryCache) { }

    errorHandler(httpErrorResponse : HttpErrorResponse){
      return Observable.throw(httpErrorResponse || "server issue") 
    }

  //Table output
    getAgentListings():Observable<any>{
       return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.GET_AGENT_API)
        .catch(this.errorHandler) ;
      }

//Register new agent 
     addNewAgent(addAgent : AddAgent):Observable<any>{
    return this.http.post<AddAgent>(GlobalConstants.API_BASE_URL + GlobalConstants.GET_AGENT_API , addAgent)
     .catch(this.errorHandler) ;
   }

      //Agent Inquiry
      getAgentInquiry(agentId:string):Observable<any>{
        return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.AGENT_INQUIRY_API.replace('{agentId}',agentId))
         .catch(this.errorHandler) ;
       }

       //update Agent Profile
       updateProfile(agentProfile:AgentUpdate):Observable<AgentUpdate>{
        return this.http.put<AgentUpdate>(GlobalConstants.API_BASE_URL + GlobalConstants.GET_AGENT_API,agentProfile).catch(this.errorHandler)
       }

       //update Agent Assoicates
       updateAssoicates(agentAssoicates : AgentUpdate):Observable<AgentUpdate>{
             return this.http.put<AgentUpdate>(GlobalConstants.API_BASE_URL + GlobalConstants.GET_AGENT_API,agentAssoicates).catch(this.errorHandler)
       }
       addAgentDocument(agentDocument :AddAgentDocument ):Observable<AddAgentDocument>{
        return this.http.post<AddAgentDocument>(GlobalConstants.API_BASE_URL + GlobalConstants.ADD_AGENT_DOCUMENT,agentDocument).catch(this.errorHandler)
     }
     getAgentDocumentInquiry(documentId : string):Observable<any>{
       return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.GET_AGENT_DOCUMENT_ENQUIRY.replace('{documentId}',documentId)).catch(this.errorHandler)
     }
     searchAgentListing(agentName:string):Observable<any>{
      return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.GET_AGENT_API + "agentName=" + agentName).catch(this.errorHandler)
     }

     //agent accounts > updating margin tier .
     updateMarginTier(acctNumber:string, marginTierUpdate: AgentMarginTierUpdate): Observable<AgentMarginTierUpdate>{
      return this.http.put<AgentMarginTierUpdate>(GlobalConstants.API_BASE_URL + GlobalConstants.AGENT_ACCOUNTS_MARGIN_TIER_UPDATE_API.replace("{accountNumber}",acctNumber)  ,marginTierUpdate).catch(this.errorHandler)
     }

     //Agent accounts Inquiry >>> customer accounts inquiry reused .
     agentAccountsInquiry(agentId:string):Observable<any>{
      return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.CUSTOMER_ACCOUNTS_INQUIRY_API.replace("{customerId}",agentId)).catch(this.errorHandler)
     }
    }