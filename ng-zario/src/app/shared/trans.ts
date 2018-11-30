export class Trans {
  _id?: string;
  _cid: string;
  _mid: string;
  appliedpromotions?: [
    {
      _pid?: string,
      discount?: number,
      meritsonpurchase?: boolean,
      merits?: number,
      zarios?: number,
      productservicecode?: string
    }
  ];
  amount: number;
  discount: number;
  meritsonpurchase: number;
  merits: number;
  zarios: number;
  description?: string;
  category?: string;
  transactiondate?: Date;
}
