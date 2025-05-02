

export class AuthRq {
    authType!: string; //PWD, BIOMETRIC
    deviceType!: string; // IOS, ANDROID, WEB
    userType!: string; // BRANCH , CUSTOMER 
    username!: string;
    password!: string;
    token!: string;
    role!: string;
    productCode !:string ; //MC or RT
    customerType !: string ; //I or C
}