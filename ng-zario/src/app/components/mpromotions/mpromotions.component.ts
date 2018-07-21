import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PromotionService } from '../../services/promotion.service';
import { ProfileService } from '../../services/profile.service';
import { Promotion, Genre, Level, Category } from '../../shared/promotions';
import { MProfile, Merchant } from '../../shared/profile';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mpromotions',
  templateUrl: './mpromotions.component.html',
  styleUrls: ['./mpromotions.component.css']
})
export class MPromotionsComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  fp: FormGroup;  // initial promotion input form control
  fmSelect: FormGroup;
  levels: Level[];
  genres: Genre[];
  categories: Category[];
  promotions: Promotion[];
  mprofiles: MProfile[];
  merchants: Array<Merchant> = [];
  merchant: Merchant;
  promotion: Promotion;
  subscription: Subscription;
  username: string = undefined;
  merchant_id: string;
  PROMOTIONS: number = null;
  ADDFLAG: boolean=true;
  message: string;
  messageClass: string;
  notUpdated: boolean = true;
  showMerchantsBox: boolean = false;
  showPromotionEntry: boolean = false;
  _mid: string = "";
  _pid: string = "";
  selectedImageFile: File =null;
  selectedImageFileName: string = "No New Image Selected";
  avatarPath: string ="../../../assets/img/avatardefault.png";
  avatarChanged: boolean = false;
  start: Date = new Date();
  min: Date = new Date(this.start.getFullYear(), this.start.getMonth(), this.start.getDate(), 0,0,0);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private promotionService: PromotionService,
    private profileService: ProfileService,
    private router: Router
  ) { 
    console.log(this.min);
    this.datePickerConfig = Object.assign( {}, 
      { 
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
        minDate: this.min,
        rangeInputFormat : 'DD/MM/YYYY'
      });
    this.createfp();
    this.createfmSelect();
  }

  // {genreCode:"All"},===========> all customers, non customers
  // {genreCode:"Customer"},======> customers only where level is all or a certain band
  // {genreCode:"Daily"},=========> Its a deily purchasing quest randomly gigen to a customer restircted to a time period of 24 hours
  // {genreCode:"Game"},==========> Its a winable item in a non Hunt game like scratch and win 
  // {genreCode:"Hunt"},==========> Its winnable in a the treasure Hunt game 
  // {genreCode:"Initial"},=======> Initial Customer Sign on deal
  // {genreCode:"Level"},=========> its a Level jump reward if level is all then all jumps are rewarded if level set to band then only jumping from that band is rewarded
  // {genreCode:"Monthly"},=======> its offered for a month only 
  // {genreCode:"Weekly"},========> its offered for a week only 

  // category can be "product" or "purchase" or "service"  or "zario" or "all"

  ngOnInit() {
    this.genres = [
      {genreCode:"All"},
      {genreCode:"Customer"},
      {genreCode:"Daily"},
      {genreCode:"Game"},
      {genreCode:"Hunt"},
      {genreCode:"Initial"},
      {genreCode:"Level"},
      {genreCode:"Monthly"},
      {genreCode:"Weekly"}
    ];
    this.levels = [
      {levelCode:"All"},
      {levelCode:"Bronze"},
      {levelCode:"Silver"},
      {levelCode:"Gold"},
      {levelCode:"Platinum"},
      {levelCode:"Pearl"},
      {levelCode:"Blackdiamond"}
    ];
    this.categories = [
      {categoryCode:"All"},
      {categoryCode:"Product"},
      {categoryCode:"Service"},
      {categoryCode:"Purchase"},
      {categoryCode:"Zario"}
    ];
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
    .subscribe(
      name => {
        this.username = name;
        // get merchants BY username. If only one merchant display promotions for that merchant and allow managing promotions. If several merchants === display promotions for the first one then allow the user to select another merchant and display thye promotions for 
        this.profileService.getMProfile(this.username)
        .subscribe(mprofiles => {
          this.mprofiles = mprofiles;
          console.log("mprofiles : ", mprofiles[0]._id, mprofiles.length);
          if (mprofiles.length === 0) {
            this.message = "Please Add a merchant profiles before adding promotions";
            this.messageClass= "alert alert-danger";
            setTimeout(() => {
              this.router.navigate(['/']); 
            }, 1500);
          } else if (mprofiles.length > 0) { 
            this.showMerchantsBox = true;
            for (var i = 0; i < mprofiles.length; i++) {
              console.log("merchant i name ", i, mprofiles[i].name);
              this.merchants.push({
                "_id":mprofiles[i]._id,
               "name": mprofiles[i].name
              });
            }
            this.fmSelect.controls['merchant'].setValue(this.merchants[0].name);
          } 
          console.log("mid ", this.mprofiles[0]._id);
          this._mid = this.mprofiles[0]._id;
          // Use merchant_id and fetch promotions 
          this.promotionService.getPromotions(this._mid)
          .subscribe(promotions => {
            this.promotions = promotions;
            console.log("promotions : ", this.promotions);
            this.PROMOTIONS = this.promotions.length;
            if (this.PROMOTIONS === 0) {
              this.showPromotionEntry = true;
              console.log("no promotions display data entry form");
            } else {
              console.log("Display promotions on page, allow an edit button, anbd comment entry by merchant");
              this.promotions[0].hearts = 519;
              this.promotions[0].hearted[0] = "Jasem Qabazard";
              this.promotions[0].hearted[1] = "Jim Vanila";
              this.promotions[0].hearted[2] = "Elizabeth Rangler";
              this.promotions[0].comments[0] = {
                username: "customerone",
                name: "uuuuuuuuuuu",
                comment:"hhhhhhhhllll kkkkk kkkkkkkk d    dddddddddd hhhhhhhh"
              }
            }
          },
            errmess => {
              console.log("error : ", errmess);
          });
        },
          errmess => {
            console.log("error : ", errmess);
        });
    });
  }

  togglePromotionEntry() {
    this.showPromotionEntry = !this.showPromotionEntry;
  }

  AddNewPromotion() {
    this.ADDFLAG = true;
    this.notUpdated = true;
  }

  createfmSelect() {
    this.fmSelect= this.formBuilder.group({
      merchant: ''
    })
  }

  changeMerchant() {
    console.log("Merchant changed");
  }

  createfp() {
    this.fp= this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(50),
        this.validateName
      ])],
      narrative: "",
      genre: "All",
      level: "All", 
      category: "All",
      daterange: [null, Validators.compose([
        Validators.required
      ])],
      discount: [0, Validators.compose([
        Validators.required,
        this.validateNumericFloat
      ])],
      price: [0, Validators.compose([
        Validators.required,
        this.validateNumericFloat
      ])],
      description: ['', Validators.compose([
        Validators.required,
        Validators.minLength(50)
      ])]
    });

    this.onChanges();
    
  }
  onChanges(): void {
    this.fp.valueChanges.subscribe(val => {
      this.notUpdated = false;
    });
  }

  
  // Function to validate name is proper format
  validateName(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z '.-]*$/);
    // Test name against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid name
    } else {
      return { 'validateName': true } // Return as invalid name
    }
  }

  validateNumericFloat(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[+-]?\d+(\.\d+)?$/);
    // Test Value for numeric against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid number
    } else {
      return { 'validateNumericFloat': true } // Return as invalid number
    }
  }

  imageFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImageFile = <File>event.target.files[0];
      this.selectedImageFileName = `Selected Image: ${this.selectedImageFile.name}`;
      this.avatarChanged = true;
      this.notUpdated = false;
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.avatarPath = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onfpSubmit() {

    this.promotion = this.fp.value;
    this.promotion._mid = this._mid;
    console.log(this.promotion);

    if (this.avatarChanged) {
      const fd = new FormData();
      fd.append('imageFile', this.selectedImageFile);
      this.profileService.imageUpload(fd).subscribe(
        imageData => {
          this.promotion.avatar = imageData.filename;
          this.promotionsDataBaseChange();
        }, 
        errormessage => {
          this.message = "Accepts image files less than 500KB ONLY, Please try another image";
          this.messageClass= "alert alert-danger";
        }
      );
    } else {
      this.promotionsDataBaseChange();
    }
  }

  editPromotion() {

  }

  promotionsDataBaseChange() {
    if (this.ADDFLAG) {
      this.promotionService.addPromotion(this.promotion).subscribe(
        data => {
          console.log("add data : ", data);
          this.messageClass= "alert alert-success";
          this.message="Promotion Add Successfull";
          setTimeout(() => {
            this.messageClass= "";
            this.message="";
          }, 1500);
// get promotions again and display
        }, 
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass= "alert alert-danger";
        }
      );
    } else {
        this.promotionService.updatePromotion(this._pid, this.promotion).subscribe(
          data => {
            console.log("update data : ", data);
            this.messageClass= "alert alert-success";
            this.message="Promotion Update Successfull";
            setTimeout(() => {
              this.messageClass= "";
              this.message="";
            }, 1500);
// get promotions again and display
          }, 
          errormessage => {
            this.message = <any>errormessage;
            this.messageClass= "alert alert-danger";
          }
        );
    }
  }

}

