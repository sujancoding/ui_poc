import { User } from "./user.model";
import { ApplicationStatus } from "./applicationstatus.model";

export class UserProfile {
    user!: User;
    appStatus!: ApplicationStatus;
    expires_at!: string;
   // jwttoken !: string;  --> token was unused because token was set in cookies .
}
