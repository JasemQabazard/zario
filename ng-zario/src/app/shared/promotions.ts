export class Promotion {
   _id?: string;
   _mid: string;
   avatar: string;
   name: string;
   narrative: string;
   generated?: boolean;
   activity?: boolean;
   hearts: number;
   hearted: Array<string>;
   timing: string;
   action: string;
   level: string;
   category: string;
   daterange: Array<Date>;
   discount: string;
   meritsonpurchase: Boolean;
   merits: number;
   zarios: number;
   productservicecode: string;
   description: string;
   comments?: [{
      _id: string,
      username: string,
      name: string,
      comment: string,
      createdAt: string
   }];
   createdAt?: Date;
}

export class Timing {
   timeCode: string;
}

export class Action {
  actionCode: string;
}

export class Level {
   levelCode: string;
}

export class Category {
   categoryCode: string;
}

export class Comment {
   _id: string;
   username: string;
   name: string;
   comment:  string;
   date: string;
}

export const merchantpromotions: Array<Promotion> = [];
merchantpromotions[0] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Generic Initial Follow',
                  narrative: 'Generic initial follow promotion',
                  generated: true,
                  activity: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'initial',
                  action: 'follow',
                  level: 'Bronze',
                  category: 'membership',
                  daterange: [
                        new Date('1954-09-09 13:22:22.000'),
                        new Date('2104-09-09 00:00:00.000')
                     ],
                  discount: '',
                  meritsonpurchase: false,
                  merits: 10,
                  zarios: 0,
                  productservicecode: '',
                  description: 'A general initial rewarding strategy for following us on zario & the Black Diamond loyalty ptogram. You will receive merit points added to your profile band at both merchant and application levels.'
               };
merchantpromotions[1] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Generic initial Purchase',
                  narrative: 'Generic initial purchase promotion',
                  generated: true,
                  activity: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'initial',
                  action: 'purchase',
                  level: 'Bronze',
                  category: 'membership',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '.2',
                  merits: 10,
                  meritsonpurchase: true,
                  zarios: 0,
                  productservicecode: '',
                  description: 'A general rewarding strategy for making the first purchase from our shop. You will receive a substantial discount on your first purchase, plus the merit points indicated added to your profile band at both merchant and application levels. You will also recieve zario points from the application for your contribution.'
               };
// this record is duplicated for each loyalty band from 2-7, with different percentages and mertis.
merchantpromotions[2] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Bronze Loyalty Band Purchase',
                  narrative: 'Bronze Loyalty Band day2day purchase promotion',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'purchase',
                  level: 'Bronze',
                  category: 'membership',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                  ],
                  discount: '0.03',
                  meritsonpurchase: true,
                  merits: 10,
                  zarios: 0,
                  productservicecode: '',
                  description: 'When you become a member customer and make general purchases from our shop you will receive the indicated discount, merits point, and zarios as a reward for the contribution. Merit Points will be added to your profile band at both merchant and application levels. As your bands with us as advance you will also gain more rewards and more discounts. You will also recieve zario points from the application for your contribution.'
               };
merchantpromotions[3] = {
                _mid: '',
                avatar: '../../../assets/img/avatardefault.png',
                name: 'Silver Loyalty Band Purchase',
                narrative: 'Silver Loyalty Band day2day purchase promotion',
                generated: true,
                hearts: 0,
                hearted: [],
                timing: 'day2day',
                action: 'purchase',
                level: 'Silver',
                category: 'membership',
                daterange: [
                  new Date('1954-09-09 13:22:22.000'),
                  new Date('2104-09-09 00:00:00.000')
                ],
                discount: '0.04',
                meritsonpurchase: true,
                merits: 12,
                zarios: 0,
                productservicecode: '',
                description: 'When you become a member customer and make general purchases from our shop you will receive the indicated discount, merits point, and zarios as a reward for the contribution. Merit Points will be added to your profile band at both merchant and application levels. As your loyalty band with us advance you will also gain more rewards and more discounts. You will also recieve zario points from the application for your contribution.'
             };
merchantpromotions[4] = {
              _mid: '',
              avatar: '../../../assets/img/avatardefault.png',
              name: 'Gold Loyalty Band Purchase',
              narrative: 'Gold Loyalty Band day2day purchase promotion',
              generated: true,
              hearts: 0,
              hearted: [],
              timing: 'day2day',
              action: 'purchase',
              level: 'Gold',
              category: 'membership',
              daterange: [
                new Date('1954-09-09 13:22:22.000'),
                new Date('2104-09-09 00:00:00.000')
              ],
              discount: '0.05',
              meritsonpurchase: true,
              merits: 14,
              zarios: 0,
              productservicecode: '',
              description: 'When you become a member customer and make general purchases from our shop you will receive the indicated discount, merits point, and zarios as a reward for the contribution. Merit Points will be added to your profile band at both merchant and application levels. As your bands with us as advance you will also gain more rewards and more discounts. You will also recieve zario points from the application for your contribution.'
           };
merchantpromotions[5] = {
            _mid: '',
            avatar: '../../../assets/img/avatardefault.png',
            name: 'Platinum Loyalty Band Purchase',
            narrative: 'Platinum Loyalty Band day2day purchase promotion',
            generated: true,
            hearts: 0,
            hearted: [],
            timing: 'day2day',
            action: 'purchase',
            level: 'Platinum',
            category: 'membership',
            daterange: [
              new Date('1954-09-09 13:22:22.000'),
              new Date('2104-09-09 00:00:00.000')
            ],
            discount: '0.06',
            meritsonpurchase: true,
            merits: 16,
            zarios: 0,
            productservicecode: '',
            description: 'When you become a member customer and make general purchases from our shop you will receive the indicated discount, merits point, and zarios as a reward for the contribution. Merit Points will be added to your profile band at both merchant and application levels. As your bands with us as advance you will also gain more rewards and more discounts. You will also recieve zario points from the application for your contribution.'
         };
merchantpromotions[6] = {
          _mid: '',
          avatar: '../../../assets/img/avatardefault.png',
          name: 'Pearl Loyalty Band Purchase',
          narrative: 'PearlLoyalty Band day2day purchase promotion',
          generated: true,
          hearts: 0,
          hearted: [],
          timing: 'day2day',
          action: 'purchase',
          level: 'Pearl',
          category: 'membership',
          daterange: [
            new Date('1954-09-09 13:22:22.000'),
            new Date('2104-09-09 00:00:00.000')
          ],
          discount: '0.07',
          meritsonpurchase: true,
          merits: 18,
          zarios: 0,
          productservicecode: '',
          description: 'When you become a member customer and make general purchases from our shop you will receive the indicated discount, merits point, and zarios as a reward for the contribution. Merit Points will be added to your profile band at both merchant and application levels. As your bands with us as advance you will also gain more rewards and more discounts. You will also recieve zario points from the application for your contribution.'
       };
merchantpromotions[7] = {
        _mid: '',
        avatar: '../../../assets/img/avatardefault.png',
        name: 'Blackdiamond Loyalty Band Purchase',
        narrative: 'Blackdiamond Loyalty Band day2day purchase promotion',
        generated: true,
        hearts: 0,
        hearted: [],
        timing: 'day2day',
        action: 'purchase',
        level: 'Blackdiamond',
        category: 'membership',
        daterange: [
          new Date('1954-09-09 13:22:22.000'),
          new Date('2104-09-09 00:00:00.000')
        ],
        discount: '0.1',
        meritsonpurchase: true,
        merits: 20,
        zarios: 0,
        productservicecode: '',
        description: 'When you become a member customer and make general purchases from our shop you will receive the indicated discount, merits point, and zarios as a reward for the contribution. Merit Points will be added to your profile band at both merchant and application levels. As your bands with us as advance you will also gain more rewards and more discounts. You will also recieve zario points from the application for your contribution.'
     };
// =======> Transitioning to a new level. this record will be duplicated for each band other than Silver, it will be changed and posted to the promotions table for Gold, Platinum, Pearl, and Blackdiamond. The discount will be .06, .08, .1, and .15 respectively. The merits will be 24, 26, 28, 30. zarioos will be .15, .2, .25, .3
merchantpromotions[8] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Transitioning to Silver Loyalty Band',
                  narrative: 'Level Transitions Silver Loyalty Band',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'transitioning',
                  level: 'Silver',        // from Bronze to Silver
                  category: 'membership',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '.05',
                  meritsonpurchase: true,
                  merits: 20,
                  zarios: 0,
                  productservicecode: '',
                  description: 'When you become a member and transitions with us from Bronze to Silver loyalty band. You will receive the indicated discount, merits point, and zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our establishment you will be rewarded merit points from your  purchases and interactions to advance your loyalty levels with both the application and us. Merits will be added to your profile band at both merchant and application levels.'
               };
merchantpromotions[9] = {
                _mid: '',
                avatar: '../../../assets/img/avatardefault.png',
                name: 'Transitioning to Gold Loyalty Band',
                narrative: 'Level Transitions to Gold Loyalty Band',
                generated: true,
                hearts: 0,
                hearted: [],
                timing: 'day2day',
                action: 'transitioning',
                level: 'Gold',        // from Silver to Gold
                category: 'membership',
                daterange: [
                  new Date('1954-09-09 13:22:22.000'),
                  new Date('2104-09-09 00:00:00.000')
                  ],
                discount: '.05',
                meritsonpurchase: true,
                merits: 20,
                zarios: 0,
                productservicecode: '',
                description: 'When you become a member and transitions with us from Silver to Gold loyalty band. You will receive the indicated discount, merits point, and zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our establishment you will be rewarded merit points from your  purchases and interactions to advance your loyalty levels with both the application and us. Merits will be added to your profile band at both merchant and application levels.'
             };
merchantpromotions[10] = {
              _mid: '',
              avatar: '../../../assets/img/avatardefault.png',
              name: 'Transitioning to Platinum Loyalty Band',
              narrative: 'Level Transitions to Platinum Loyalty Band',
              generated: true,
              hearts: 0,
              hearted: [],
              timing: 'day2day',
              action: 'transitioning',
              level: 'Platinum',        // from Gold Platinum
              category: 'membership',
              daterange: [
                new Date('1954-09-09 13:22:22.000'),
                new Date('2104-09-09 00:00:00.000')
                ],
              discount: '.05',
              meritsonpurchase: true,
              merits: 20,
              zarios: 0,
              productservicecode: '',
              description: 'When you become a member and transitions with us from Gold to Platinum loyalty band. You will receive the indicated discount, merits point, and zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our establishment you will be rewarded merit points from your  purchases and interactions to advance your loyalty levels with both the application and us. Merits will be added to your profile band at both merchant and application levels.'
           };
merchantpromotions[11] = {
            _mid: '',
            avatar: '../../../assets/img/avatardefault.png',
            name: 'Transitioning to Pearl Loyalty Band',
            narrative: 'Level Transitions to Pearl Loyalty Band',
            generated: true,
            hearts: 0,
            hearted: [],
            timing: 'day2day',
            action: 'transitioning',
            level: 'Pearl',        // from Platinum to Pearl
            category: 'membership',
            daterange: [
              new Date('1954-09-09 13:22:22.000'),
              new Date('2104-09-09 00:00:00.000')
              ],
            discount: '.05',
            meritsonpurchase: true,
            merits: 20,
            zarios: 0,
            productservicecode: '',
            description: 'When you become a member and transitions with us from Platinum to Pearl loyalty band. You will receive the indicated discount, merits point, and zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our establishment you will be rewarded merit points from your  purchases and interactions to advance your loyalty levels with both the application and us. Merits will be added to your profile band at both merchant and application levels.'
         };
merchantpromotions[12] = {
          _mid: '',
          avatar: '../../../assets/img/avatardefault.png',
          name: 'Transitioning to Blackdiamond Loyalty Band',
          narrative: 'Level Transitions to Blackdiamond Loyalty Band',
          generated: true,
          hearts: 0,
          hearted: [],
          timing: 'day2day',
          action: 'transitioning',
          level: 'Blackdiamond',        // from Pearl to Blackdiamond
          category: 'membership',
          daterange: [
            new Date('1954-09-09 13:22:22.000'),
            new Date('2104-09-09 00:00:00.000')
            ],
          discount: '.05',
          meritsonpurchase: true,
          merits: 20,
          zarios: 0,
          productservicecode: '',
          description: 'When you become a member and transitions with us from Pearl to Blackdiamond loyalty band. You will receive the indicated discount, merits point, and zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our establishment you will be rewarded merit points from your  purchases and interactions to advance your loyalty levels with both the application and us. Merits will be added to your profile band at both merchant and application levels.'
       };
// ====> product discount
merchantpromotions[13] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Specific Special Product Promotion',
                  narrative: 'Product Promotion',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  // timing: could be any of the setting- when set to=day2day: means the discount on the product or service is available all the time when the promotion is active. =hourly or any timimg indicator mean the product or service is available for one hour/ one day/ one week/ one month during that day to each signed in customer to the promotions.
                  timing: 'day2day',
                  action: 'purchase',
                  level: 'All',        // for all levels
                  category: 'product',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '.15',
                  meritsonpurchase: true,
                  merits: 5,
                  zarios: 0,
                  productservicecode: '', // user must amend and enter product number, product avatar, and fix the description.
                  description: 'When you become a member and follow us as a merchant you will be offered product purchases at a low discount such as this product mentioned in this promotion. You will also receive the indicated merits point, and zarios, or gifts as a reward for the contribution. Merits will be added to your profile band at both merchant and application levels. You will also recieve zario points from the application for your contribution.'
               };
// ====> service discount
merchantpromotions[14] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Specific Special Service Promotion',
                  narrative: 'Service Promotion',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  // timing: could be any of the setting- when set to=day2day: means the discount on the service is available all the time when the promotion is active. =hourly or any timimg indicator mean the service is available for one hour/ one day/ one week/ one month during that day to each signed in customer to the promotions.
                  timing: 'day2day',
                  action: 'purchase',
                  level: 'All',        // for all levels
                  category: 'service',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '.15',
                  meritsonpurchase: true,
                  merits: 5,
                  zarios: 0,
                  productservicecode: '', // user must amend and enter service number, service avatar, and fix the description.
                  description: 'When you become a member and follow us as a merchant you will be offered service purchases at a low discount such as this service mentioned in this promotion. You will also receive the indicated merits point, and zarios, or gifts as a reward for the contribution. Merits will be added to your profile band at both merchant and application levels. You will also recieve zario points from the application for your contribution.'
               };
// =====> Treasure Hunt
merchantpromotions[15] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Treasure Hunt Game Promotion',
                  narrative: 'Treasure Hunt',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  // timing: could be any of the setting- when set to =day2day: means the treasure hunt reward is available all the time when the promotion is active. =hourly or any timimg indicator means the reward will be available for one hour/ one day/ one week/ one month for each signed in customer/ member to the promotions.
                  timing: 'day2day',
                  action: 'treasurehunt',
                  level: 'Silver',        // All for all levels or specific level only gets this reward as a by product of playing treasure hunt game.
                  category: 'membership', // when set to membership then members receive an added or special discount indicated in the disocunt field, or can receive merit points as an immediet bonus when they find the item, or receive zarios immedietly as they find them in the treasure hunt game. when set to 'product' or 'service' then a particular product or service is the subject matter of the discount. It should be described and product or service number entered.
                  daterange: [
                        new Date('1954-09-09 13:22:22.000'),
                        new Date('2104-09-09 00:00:00.000')
                     ],
                  discount: '.15',
                  meritsonpurchase: false,
                  merits: 5,
                  zarios: 0,
                  productservicecode: '', // user must amend and enter service number, service avatar, and fix the description.
                  description: 'Find product discounts, services, merit points, zarios, and gifts in our treasure hunt game in your promotions page on the map as you go through our merchant stores or when you go to prominent locations in your area. You may stumble upon these reward offers when you least expect. Visit our store if you wish to find this reward discount offered on the item product or service mentioned, or find the merit points or zarios associated with the reward. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
               };
// ====> game promotion
merchantpromotions[16] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'General Game Promotion',
                  narrative: 'General Game',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  // timing: could be any of the setting- when set to =day2day: means anyt generic game reward is available all the time when the promotion is active. =hourly or any timimg indicator means the reward will be available for one hour/ one day/ one week/ one month for each signed in customer/ member to the promotions.
                  timing: 'day2day',
                  action: 'game',
                  level: 'Silver',        // All for all levels or specific level only gets this reward as a by product of playing any of our games.
                  category: 'membership', // when set to membership then members receive an added or special discount indicated in the discount field, or can receive merit points as an immediet bonus when they play and win the game, or receive zarios immedietly as they win. when set to product or service then a particular product or service is the subject matter of the discount. It should be described and product or service number entered.
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '.15',
                  meritsonpurchase: false,
                  merits: 5,
                  zarios: 0,
                  productservicecode: '', // user must amend and enter service number, service avatar, and fix the description.
                  description: 'Win this product discount, service, merit points, zarios, or gifts in one of our offered games. You may play these games as they are offered to you when you level up your band with the application and with our merchant store. Visit our store for more discounts and rewards. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
               };
merchantpromotions[17] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Visit our store location promotion',
                  narrative: 'Visit our store',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'hourly',    // usually hourly or daily for a certain event promotion
                  action: 'visit',
                  level: 'All',
                  category: 'all',
                  daterange: [
                        new Date('1954-09-09 13:22:22.000'),
                        new Date('2104-09-09 00:00:00.000')
                     ],
                  discount: '',
                  meritsonpurchase: false,
                  merits: 10,
                  zarios: 0,
                  productservicecode: '',
                  description: 'A general rewarding strategy for visiting our shop. You will receive a free gift, snaks, and drinks, plus extra merit points if you purchase from us during this promotion. Merits will be added to your profile band at both merchant and application levels.'
               };
export const apppromotions = [];
apppromotions[0] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'global Bronze purchase',
                  narrative: 'application Purchase promotion for Bronze Loyalty Band',
                  generated: true,
                  activity: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'purchase',
                  level: 'Bronze',
                  category: 'application',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 10,
                  zarios: 0.1,
                  productservicecode: '',
                  description: 'A general global rewarding of zario points and application based merits to the customer for any purchase made from our member merchants in the Zario & the Black Diamond Loyalty Application. Merit points and zarios are rewarded towards customer application bands in his profile. Same bonus points are also rewarded to MERCHANT profile as well. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
               };
apppromotions[1] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'global Silver purchase',
                  narrative: 'application Purchase promotion for Silver Loyalty Band',
                  generated: true,
                  activity: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'purchase',
                  level: 'Silver',
                  category: 'application',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 12,
                  zarios: 0.2,
                  productservicecode: '',
                  description: 'A general global rewarding of zario points and application based merits to the customer for any purchase made from our member merchants in the Zario & the Black Diamond Loyalty Application. Merit points and zarios are rewarded towards customer application bands in his profile. Same bonus points are also rewarded to MERCHANT profile as well. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
              };
apppromotions[2] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'global Gold purchase',
                  narrative: 'application purchase promotion for Gold Loyalty Band',
                  generated: true,
                  activity: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'purchase',
                  level: 'Gold',
                  category: 'application',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 14,
                  zarios: 0.3,
                  productservicecode: '',
                  description: 'A general global rewarding of zario points and application based merits to the customer for any purchase made from our member merchants in the Zario & the Black Diamond Loyalty Application. Merit points and zarios are rewarded towards customer application bands in his profile. Same bonus points are also rewarded to MERCHANT profile as well. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
              };
apppromotions[3] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'global Platinum purchase',
                  narrative: 'application purchase promotion for Platinum Loyalty Band',
                  generated: true,
                  activity: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'purchase',
                  level: 'Platinum',
                  category: 'application',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 16,
                  zarios: 0.4,
                  productservicecode: '',
                  description: 'A general global rewarding of zario points and application based merits to the customer for any purchase made from our member merchants in the Zario & the Black Diamond Loyalty Application. Merit points and zarios are rewarded towards customer application bands in his profile. Same bonus points are also rewarded to MERCHANT profile as well. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
                };
apppromotions[4] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'global Pearl purchase',
                  narrative: 'application purchase promotion for Pearl Loyalty Band',
                  generated: true,
                  activity: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'purchase',
                  level: 'Pearl',
                  category: 'application',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 18,
                  zarios: 0.5,
                  productservicecode: '',
                  description: 'A general global rewarding of zario points and application based merits to the customer for any purchase made from our member merchants in the Zario & the Black Diamond Loyalty Application. Merit points and zarios are rewarded towards customer application bands in his profile. Same bonus points are also rewarded to MERCHANT profile as well. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
              };
apppromotions[5] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'global Blackdiamond purchase',
                  narrative: 'application purchase promotion for blackdiamond Loyalty Band',
                  generated: true,
                  activity: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'purchase',
                  level: 'Blackdiamond',
                  category: 'application',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 20,
                  zarios: 1,
                  productservicecode: '',
                  description: 'A general global rewarding of zario points and application based merits to the customer for any purchase made from our member merchants in the Zario & the Black Diamond Loyalty Application. Merit points and zarios are rewarded towards customer application bands in his profile. Same bonus points are also rewarded to MERCHANT profile as well. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
              };
apppromotions[6] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Treasure Hunt Discount',
                  narrative: 'Treasure Hunt',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  // timing: could be any of the setting- when set to =day2day: means the treasure hunt reward is available all the time when the promotion is active. =hourly or any timimg indicator means the reward will be available for one hour/ one day/ one week/ one month for each signed in customer/ member to the promotions.
                  timing: 'day2day',
                  action: 'treasurehunt',
                  level: 'Silver',        // All for all levels or specific level only gets this reward as a by product of playing treasure hunt game.
                  category: 'application', // when set to membership then members receivce an added or special discount indicated in the disocunt field, or can receive merit points as an immediet bonus when they find the item, or receive zarios immedietly as they find them in the hunt game. when set to product or service then a particular product or service is the subject matter of the discount. It should be described and product or service number entered.
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: false,
                  merits: 5,
                  zarios: 0.1,
                  productservicecode: '', // user must amend and enter service number, service avatar, and fix the description.
                  description: 'Find product discounts, services, merit points, zarios, and gifts item in our treasure hunt game in your promotions page  on the map as you go through our merchant stores or when you go to prominent locations in your area. You may stumble upon this reward offer when you least expect. Visit our stores if you wish to find this reward discount offered, or find the merit points and zarios associated with the reward. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
               };
apppromotions[7] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'General Game Promotion',
                  narrative: 'General Game',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  // timing: could be any of the setting- when set to =day2day: means anyt generic game reward is available all the time when the promotion is active. =hourly or any timimg indicator means the reward will be available for one hour/ one day/ one week/ one month for each signed in customer/ member to the promotions.
                  timing: 'day2day',
                  action: 'game',
                  level: 'Silver',        // All for all levels or specific level only gets this reward as a by product of playing any of our games.
                  category: 'application', // when set to membership then members receive an added or special discount indicated in the discount field, or can receive merit points as an immediet bonus when they play and win the game, or receive zarios immedietly as they win. when set to product or service then a particular product or service is the subject matter of the discount. It should be described and product or service number entered.
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: false,
                  merits: 5,
                  zarios: 0.1,
                  productservicecode: '', // user must amend and enter service number, service avatar, and fix the description.
                  description: 'Win this reward in one of our offered games. You may play these games as they are offered to you when you level up your band with the application and with our merchant stores. Visit our stores for more discounts and rewards. This is our way to thank you for your contribution in enriching our community of shops, members, and application.'
               };
apppromotions[8] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Visit our store location promotion',
                  narrative: 'Visit our store',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'hourly',    // usually hourly or daily for a certain event promotion
                  action: 'visit',
                  level: 'All',
                  category: 'all',
                  daterange: [
                        new Date('1954-09-09 13:22:22.000'),
                        new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: false,
                  merits: 5,
                  zarios: 0.05,
                  productservicecode: '',
                  description: 'A general rewarding strategy for visiting any of our merchants. You will receive extra merit points. Merits and Zarios will be added to your profile band at the application levels.'
                };
// =======> Transitioning to a new level. this record will be duplicated for each band other than Silver, it will be changed and posted to the promotions table for Gold, Platinum, Pearl, and Blackdiamond. The discount will be .06, .08, .1, and .15 respectively. The merits will be 24, 26, 28, 30. zarioos will be .15, .2, .25, .3
apppromotions[9] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Transitioning to Silver Application Loyalty Band',
                  narrative: 'Level Transitions Silver Application Loyalty Band',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'transitioning',
                  level: 'Silver',        // from Bronze to Silver
                  category: 'application',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 20,
                  zarios: 0.1,
                  productservicecode: '',
                  description: 'When you become a member and transitions from Bronze to Silver Application loyalty bands. You will receive the indicated merits point, zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our merchasnt establishments you will be rewarded merit points from your purchases and interactions to advance your loyalty levels with both the application and merchants.'
                };
apppromotions[10] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Transitioning to Gold Application Loyalty Band',
                  narrative: 'Level Transitions to Application Gold Loyalty Band',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'transitioning',
                  level: 'Gold',        // from Silver to Gold
                  category: 'application',
                  daterange: [
                    new Date('1954-09-09 13:22:22.000'),
                    new Date('2104-09-09 00:00:00.000')
                    ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 20,
                  zarios: 0.2,
                  productservicecode: '',
                  description: 'When you become a member and transitions from Silver to Gold Application loyalty bands. You will receive the indicated merits point, zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our merchasnt establishments you will be rewarded merit points from your purchases and interactions to advance your loyalty levels with both the application and merchants.'
                };
apppromotions[11] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Transitioning to Platinum application Loyalty Band',
                  narrative: 'Level Transitions to Platinum application Loyalty Band',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'transitioning',
                  level: 'Platinum',        // from Gold Platinum
                  category: 'application',
                  daterange: [
                  new Date('1954-09-09 13:22:22.000'),
                  new Date('2104-09-09 00:00:00.000')
                  ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 20,
                  zarios: 0.3,
                  productservicecode: '',
                  description: 'When you become a member and transitions from Gold to Platinum Application loyalty bands. You will receive the indicated merits point, zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our merchasnt establishments you will be rewarded merit points from your purchases and interactions to advance your loyalty levels with both the application and merchants.'
                };
apppromotions[12] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Transitioning to Pearl application Loyalty Band',
                  narrative: 'Level Transitions to Pearl application Loyalty Band',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'transitioning',
                  level: 'Pearl',        // from Platinum to Pearl
                  category: 'application',
                  daterange: [
                  new Date('1954-09-09 13:22:22.000'),
                  new Date('2104-09-09 00:00:00.000')
                  ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 20,
                  zarios: 0.4,
                  productservicecode: '',
                  description: 'When you become a member and transitions from Platinum to Pearl Application loyalty bands. You will receive the indicated merits point, zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our merchasnt establishments you will be rewarded merit points from your purchases and interactions to advance your loyalty levels with both the application and merchants.'
                };
apppromotions[13] = {
                  _mid: '',
                  avatar: '../../../assets/img/avatardefault.png',
                  name: 'Transitioning to Blackdiamond application Loyalty Band',
                  narrative: 'Level Transitions to Blackdiamond application Loyalty Band',
                  generated: true,
                  hearts: 0,
                  hearted: [],
                  timing: 'day2day',
                  action: 'transitioning',
                  level: 'Blackdiamond',        // from Pearl to Blackdiamond
                  category: 'application',
                  daterange: [
                  new Date('1954-09-09 13:22:22.000'),
                  new Date('2104-09-09 00:00:00.000')
                  ],
                  discount: '',
                  meritsonpurchase: true,
                  merits: 20,
                  zarios: 0.5,
                  productservicecode: '',
                  description: 'When you become a member and transitions from Pearl to Blackdiamond Application loyalty bands. You will receive the indicated merits point, zarios, or gifts as a reward for your contribution. As you keep adding value to the Zario & the Black Diamond Loyalty application and to our merchasnt establishments you will be rewarded merit points from your purchases and interactions to advance your loyalty levels with both the application and merchants.'
                };
