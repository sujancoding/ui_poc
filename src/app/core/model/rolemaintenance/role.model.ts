export class AddRole{
    roleId !: string ;
    roleName !: string ;
    roleDescription !: string ;
    accessControls !: AccessControlModel[] ;

    constructor(obj ?: any){
      this.roleId = obj && obj.roleId || "" ;
      this.roleName = obj && obj.roleName || "" ;
      this.roleDescription = obj && obj.roleDescription || "" ;
      this.accessControls = obj && obj.accessControls || null ;
    }
}

export class AccessControlModel{
    accessControlId !: string ;

    constructor(obj ?: any){
        this.accessControlId = obj && obj.accessControlId || "" ;
      }

}


export class UpdateRole{
  accessControls !: AccessControlModel[] ;
  status !: string;


  constructor(obj ?: any){
    this.accessControls = obj && obj.accessControls || null ;
    this.status = obj && obj.status || null
  }
}

// {
//     "roleName": "TELLER T1",
//     "roleDescription" : "BRANCH MANAGER BM , EXECUTIVE OFFICER",
//     "accessControls": [
//         {
//             "accessControlId": "1"
//         },
//         {
//             "accessControlId": "2"
//         }
//     ]
// }


// "{
//   ""accessControls"": [
//       {
//           ""accessControlId"": ""3""
//       },
//       {
//           ""accessControlId"": ""4""
//       }
//   ]
// }"