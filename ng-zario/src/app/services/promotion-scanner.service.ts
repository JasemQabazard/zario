import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotions';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

@Injectable()
export class PromotionScannerService {

  constructor() { }

  cartCore (promotions: Promotion[], mBand): Promotion[] {
    const relevant: Array<Promotion> = [];
    for (let x = 0; x < promotions.length; x++) {
     if (promotions[x].timing === 'initial' && mBand === '') {
        relevant.push(promotions[x]);
      } else if (promotions[x].action === 'purchase' && (promotions[x].level === 'All' || promotions[x].level === mBand)) {
        relevant.push(promotions[x]);
      } else if (promotions[x].action === 'transitioning' || promotions[x].action === 'visit') {
        relevant.push(promotions[x]);
      }
    }
    return relevant;
  }

  cartTransitions (promotions: Promotion[], mBand): Promotion[] {
    const relevant: Array<Promotion> = [];
    for (let x = 0; x < promotions.length; x++) {
     if (promotions[x].action !== 'transitioning') {
        relevant.push(promotions[x]);
      } else if (promotions[x].level === mBand) {
        relevant.push(promotions[x]);
      }
    }
    return relevant;
  }

}
