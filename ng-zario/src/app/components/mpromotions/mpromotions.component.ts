import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormBuilder, FormGroup, FormArray , Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PromotionService } from '../../services/promotion.service';
import { ProfileService } from '../../services/profile.service';
import { Promotion, Genre, Level, Category } from '../../shared/promotions';
import { MProfile, Merchant } from '../../shared/profile';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mpromotions',
  templateUrl: './mpromotions.component.html',
  styleUrls: ['./mpromotions.component.css']
})
export class MPromotionsComponent implements OnInit, OnDestroy {
  datePickerConfig: Partial<BsDatepickerConfig>;
  fp: FormGroup;  // initial promotion input form control
  fmSelect: FormGroup;
  levels: Level[];
  genres: Genre[];
  categories: Category[];
  promotions: Promotion[];
  mprofiles: Array<MProfile> = [];
  merchants: Array<Merchant> = [];
  merchant: Merchant;
  promotion: Promotion;
  subscription: Subscription;
  username: string = undefined;
  realname: string = undefined;
  merchant_id: string;
  NEWPROMOTION: boolean=true;
  UPDATINGCOMMENT_J: number=null;
  message: string;
  messageClass: string;
  notUpdated: boolean = true;
  commentNotUpdated: boolean = true;
  showMerchantsBox: boolean = false;
  showPromotionEntry: boolean = false;
  _mid: string = "";
  _pid: string = "";
  selectedImageFile: File =null;
  selectedImageFileName: string = "No New Image Selected";
  avatarPath: string ="../../../assets/img/avatardefault.png";
  avatarChanged: boolean = false;
  komments: Array<string>=[];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private promotionService: PromotionService,
    private profileService: ProfileService,
    private router: Router
  ) { 
    this.datePickerConfig = Object.assign( {}, 
      { 
        containerClass: 'theme-dark-blue',
        showWeekNumbers: false,
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
    this.subscription = this.authService.getRealname()
    .subscribe(
      rname => {
        this.realname = rname;
      });

    this.subscription = this.authService.getUsername()
    .subscribe(
      name => {
        this.username = name;
        this.subscription.unsubscribe();
        // get user record 
        // if _gid === null return error
        // if _mid === null return error
        // if MERCHANT fall through existing logic 
        // if merchant get profiles using _mid get with profile service then fall through existing logic
        this.authService.getUser(this.username)
        .subscribe(user => {
          console.log("user : ", user);
          if (user._gid === null || user._mid === null) {
            this.message = "Group Admin must set Group and Merchant Profile before proceeding";
            this.messageClass= "alert alert-danger";
            setTimeout(() => {
              this.router.navigate(['/']); 
            }, 1500);
          }
          if (user.role === "MERCHANT") {
            this.profileService.getMProfile(this.username)
            .subscribe(mprofiles => {
              this.mprofiles = mprofiles;
              console.log("this.mprofiles : ", this.mprofiles[0]._id, this.mprofiles.length);
              this.processPromotions();
            },
            errormessage => {
              this.message = <any>errormessage;
              this.messageClass= "alert alert-danger";
            });
          } else if (user.role === "merchant") {
            console.log("merchant logic here");
            this.profileService.getMProfileID(user._mid)
            .subscribe(mprofile => {
              this.mprofiles[0] = mprofile;
              console.log("this.mprofiles : ", this.mprofiles[0]);
              this.processPromotions();
            },
            errormessage => {
              this.message = <any>errormessage;
              this.messageClass= "alert alert-danger";
            });
          }
        },
          errormessage => {
              this.message = <any>errormessage;
              this.messageClass= "alert alert-danger";
        });
        // get merchants BY username only if the role === MERCHANT. If only one merchant display promotions for that merchant and allow managing promotions. If several merchants === display promotions for the first one then allow the user to select another merchant and display the promotions  

    });
  }

  processPromotions() {
    if (this.mprofiles.length === 0) {
      this.message = "Please Add a merchant profiles before adding promotions";
      this.messageClass= "alert alert-danger";
      setTimeout(() => {
        this.router.navigate(['/']); 
      }, 1500);
    } else if (this.mprofiles.length > 0) {
      this.showMerchantsBox = true;
      for (var i = 0; i < this.mprofiles.length; i++) {
        console.log("merchant i name ", i, this.mprofiles[i].name);
        this.merchants.push({
          "_id":this.mprofiles[i]._id,
          "name": this.mprofiles[i].name
        });
      }
      this.fmSelect.controls['merchant'].setValue(this.merchants[0].name);
    } 
    this._mid = this.mprofiles[0]._id;
    // Use merchant_id and fetch promotions 
    this.promotionService.getPromotions(this._mid)
    .subscribe(promotions => {
      this.promotions = promotions;
      console.log("promotions : ", this.promotions);
      for (var x = 0; x < this.promotions.length; x++) {
        this.komments.push(" ");
        console.log("building komments i = ", x);
      }
      if (this.promotions.length === 0) {
        this.showPromotionEntry = true;
        console.log("no promotions display data entry form");
      } else {
        console.log("Display promotions on page, allow an edit button, and comment entry by merchant");
      }
    },
    errormessage => {
        this.message = <any>errormessage;
        this.messageClass= "alert alert-danger";
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  togglePromotionEntry() {
    this.showPromotionEntry = !this.showPromotionEntry;
  }

  AddNewPromotion() {
    this.NEWPROMOTION = true;
    this.notUpdated = true;
  }

  changeMerchant(mvalue) {
    for ( var ndx = 0; ndx < this.merchants.length; ndx++) {
      if(this.merchants[ndx].name == this.fmSelect.controls['merchant'].value) {
        break;
      }
   }
    this.fmSelect.controls['merchant'].setValue(this.merchants[ndx].name);
    this._mid = this.mprofiles[ndx]._id;
    // Use merchant_id and fetch promotions 
    this.promotionService.getPromotions(this._mid)
    .subscribe(promotions => {
      this.promotions = promotions;
      console.log("promotions : ", this.promotions);
      if (this.promotions.length === 0) {
        this.showPromotionEntry = true;
        console.log("no promotions display data entry form");
      } else {
        console.log("Display promotions on page, allow an edit button, and comment entry by merchant");
      }
    },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass= "alert alert-danger";
    });
  }

  createfmSelect() {
    this.fmSelect= this.formBuilder.group({
      merchant: ''
    });
  }

  createfp() {
    this.fp= this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
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
          this.promotion.avatar = "avatars/"+imageData.filename;
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

  promotionsDataBaseChange() {
    if (this.NEWPROMOTION) {
      this.promotionService.addPromotion(this.promotion).subscribe(
        data => {
          console.log("add data : ", data);
          this.messageClass= "alert alert-success";
          this.message="Promotion Add Successfull";
          setTimeout(() => {
            this.messageClass= "";
            this.message="";
          }, 1500);
          // get promotions again and make ready for display
          this.getPromotions();
          this.clearfp();
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
            // get promotions again and make ready for display
            this.getPromotions();
            this.clearfp();
          }, 
          errormessage => {
            this.message = <any>errormessage;
            this.messageClass= "alert alert-danger";
          }
        );
    }
  }
  
  clearfp() {
    this.avatarPath = "../../../assets/img/avatardefault.png";
    this.fp.reset();
    this.fp.setValue ({
      name: "",
      narrative: "",
      genre: "All",
      level: "All", 
      category: "All",
      daterange: null,
      discount: 0,
      price: 0,
      description: ""
    });
    this.AddNewPromotion();
    this.togglePromotionEntry();
  }

  getPromotions() {
      // Use merchant_id and fetch promotions 
      this.promotionService.getPromotions(this._mid)
      .subscribe(promotions => {
        this.promotions = promotions;
        console.log("promotions : ", this.promotions);
      },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass= "alert alert-danger";
      });
  }

  editPromotion(i) {
    // get the index value for the promotion and set the form to its values from the array 
    // allow for change and update when requested. 
    console.log("promotion index : ", i);
    this._pid = this.promotions[i]._id;
    if (this.promotions[i].avatar) {
      this.avatarPath = this.promotions[i].avatar;
    } else {
      this.avatarPath = "../../../assets/img/avatardefault.png";
    }
    const dates: Date[] = [
      new Date(this.promotions[i].daterange[0]),
      new Date(this.promotions[i].daterange[1])
    ]
    this.fp.setValue ({
      name: this.promotions[i].name,
      narrative: this.promotions[i].narrative,
      genre: this.promotions[i].genre,
      level: this.promotions[i].level, 
      category: this.promotions[i].category,
      daterange: dates,
      discount: this.promotions[i].discount,
      price: this.promotions[i].price,
      description: this.promotions[i].description
    });
    console.log("date range : ", this.fp.value.daterange);
    this.NEWPROMOTION = false;
    this.notUpdated = true;
    this.showPromotionEntry = true;
  }

  addUpdateComments(i) {
    if (!this.UPDATINGCOMMENT_J) {
      const remark = {
        username: this.username,
        name: this.realname,
        comment:  this.komments[i]
      }
      this.komments[i] = "";
      this.promotionService.addComment(this.promotions[i]._id, remark)
      .subscribe(promotion => {
        this.promotions[i] = promotion;
        console.log("promotions : ", this.promotions);
      },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass= "alert alert-danger";
      });
    } else {
      const remark = {
        "comment":  this.komments[i]
      }
      this.komments[i] = "";
      console.log("remark.comment : ", this.UPDATINGCOMMENT_J, remark);
      this.promotionService.updateComment(this.promotions[i]._id, this.promotions[i].comments[this.UPDATINGCOMMENT_J]._id, remark)
      .subscribe(promotion => {
        this.promotions[i] = promotion;
        console.log("promotions : ", this.promotions);
      },
        errormessage => {
          this.message = <any>errormessage;
          this.messageClass= "alert alert-danger";
      });
      if (this.UPDATINGCOMMENT_J) {this.cancelUpdateComments(i)};
    }
  }

  deleteComments(i,j) {
    console.log("delete ixj:", i,j);
    if (this.UPDATINGCOMMENT_J) {this.cancelUpdateComments(i)};
    this.promotionService.deleteComment(this.promotions[i]._id, this.promotions[i].comments[j]._id)
    .subscribe(promotion => {
      this.promotions[i] = promotion;
      console.log("promotions : ", this.promotions);
    },
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass= "alert alert-danger";
    });
  }

  editComments(i,j) {
    console.log("edit ixj:", i,j);
    this.komments[i]=this.promotions[i].comments[j].comment;
    this.UPDATINGCOMMENT_J = j;
    this.commentNotUpdated = true;
  }

  cancelUpdateComments(i) {
    this.komments[i]="";
    this.UPDATINGCOMMENT_J = null;
    this.commentNotUpdated = false;
  }

}

