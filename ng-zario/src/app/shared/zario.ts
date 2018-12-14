export class Zario {
  _id?: string;
  _fid: string;
  _toid: string;
  participants: string;   // a2m a2c m2c m2m c2m c2c
  description: string;   // zario transaction description
  quantity: number;
  price: number;
  ukey?: string;
  rkey?: string;
  createdAt?: Date;
}
