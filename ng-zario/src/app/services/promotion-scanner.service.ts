import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotions';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

@Injectable()
export class PromotionScannerService {

  constructor() { }

  cartCore (promotions: Promotion[], band): Promotion[] {
    const relevant: Array<Promotion> = [];
    for (let x = 0; x < promotions.length; x++) {
     if (promotions[x].timing === 'initial' && band === '') {
        relevant.push(promotions[x]);
      } else if (promotions[x].action === 'purchase' && (promotions[x].level === 'All' || promotions[x].level === band)) {
        relevant.push(promotions[x]);
      } else if (promotions[x].action === 'transitioning' || promotions[x].action === 'visit') {
        relevant.push(promotions[x]);
      }
    }
    return relevant;
  }

  cartTransitions (promotions: Promotion[], band, tiers): Promotion[] {
    const relevant: Array<Promotion> = [];
    const BAND: string[] = ['NONE', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Pearl', 'Blackdiamond'];
    console.log('cartTransitions newband tiers ', band, tiers);
    for (let x = 0; x < promotions.length; x++) {
      if (promotions[x].action !== 'transitioning') {
        relevant.push(promotions[x]);
      }
    }
    while (tiers) {
      for (let x = 0; x < promotions.length; x++) {
          if (promotions[x].level === band) {
              relevant.push(promotions[x]);
        }
      }
      band = BAND[BAND.indexOf(band) - 1];
      tiers--;
    }
    return relevant;
  }

}
