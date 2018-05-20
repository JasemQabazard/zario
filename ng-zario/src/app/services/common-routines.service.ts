import { Injectable } from '@angular/core';

@Injectable()
export class CommonRoutinesService {

  constructor() { }

  public codeGen() {
      var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var code = '';
      for (var i = 0; i < 6; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          code += charSet.substring(randomPoz, randomPoz + 1);
      }
      return code;
  }
}
