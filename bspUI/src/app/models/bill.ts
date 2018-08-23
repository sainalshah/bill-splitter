export interface Bill {
    id: String;
    createdBy: String;
    createdTstamp: Date;
    amount: Number;
    type: String;
    payableUsers: [String];
    description: String;
    attachment: String;
}
