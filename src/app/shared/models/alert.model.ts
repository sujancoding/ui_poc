export class Alert {
    id!: string;
    type!: AlertType;
    message!: string;
    autoClose!: boolean;
    keepAfterRouteChange?: boolean;
    //keepAfterRouteChange: boolean = false;
    fade!: boolean;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}