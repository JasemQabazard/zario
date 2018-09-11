import { Injectable } from '@angular/core';

@Injectable()
export class CommonRoutinesService {

  constructor() { }

  public codeGen() {
      const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      let randomPoz;
      for (let i = 0; i < 6; i++) {
          randomPoz = Math.floor(Math.random() * charSet.length);
          code += charSet.substring(randomPoz, randomPoz + 1);
      }
      return code;
  }
}
