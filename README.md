# zario
============server-setup======git branch============
   - added the express server, mongodb, and ngzario built by ng new for angular
==========add-bootsrap4=======git branch============
   - remove all test files from angular 
   - create .gitignore file to ignore all node_modules
   - add bootsrap and its dependencies to angular
   - add server.log file and console.log for server activities 
   - change the angular build to produce public folder on server 
      level with all trhe directions to the new index.js file
==========add-nav-routes=======git branch============
   - create app Route module
   - nav bar logo menues 
   - build components related to menues and main routes
==========add-security=======git branch============ old added needs to be redone after  express-generator=====================================================================
   - Registration
   - Log in
   - Log out
==========express-gen-secure=======git branch=====Completed: 18April 2018========
   - Express generator then add-security
   - Registration -------------------security to be done again as to new passport at coursera
   - Log in -------------------------
   - Log out
=================================================================================
=== branchName:add-db-models== start:19April2018== Completed: 24April2018  ====
=================================================================================
   - add all db structures and models for your data
   - add all Routers 
=================================================================================
===  branchName:add-https-cors== start:24April2018== Completed: 29April 2018 ====
=================================================================================
   - add https route
   - add CORS
   - upload imade with multer
=================================================================================
===  branchName: added-security== start:29April2018== Completed: 30 May 2018 ====
================================================================================= 
   - start working on the client side in  order to make testing simpler and easier for server security checks
   - on clients do register + sign in / out + Password Change + Forget Password with mailer
   - email notifications for any activity on security (1-confirm email on registration by sendinga code. 2- password change notification. 3-Forget Password and Reset notifications.)
   - Route authentication for each user type:{Administrator, Customer, Merchant}. Display correct menu for each type. 
=================================================================================
===  branchName: add-profiles == start:31Maye2018 == Completed: 99 June 2018 ====
================================================================================= 
   - review models and routes for data base table to fit latest front end menu 
   - create 3 users names= CustomerOne, MerchantOne, Administrator. increase CustomersTwo, etc... and MerchantTwo, etc .....
   - CUSTOMER/ MERCHANT profile menu work around = 2 components based on flags
   - Company profile with image loading and details 
   - CUSTOMER profile with customer loading image and id for more zario and reputation gains
=================================================================================
===  branchName:UserAmend == start:28July2018== Completed: 02 Aug 2018 ====
================================================================================= 
amend user date should be a quick component
=================================================================================
===  branchName:MerchantAddCustomer == start:02Aug2018== Completed: 15 Aug 2018 ====
================================================================================= 
   - MERCHANT can record a CUSTOMER to the application. Along with the recording of customer transactions on the system.
   - This CUSTOMER will be flaged as recruited by that MERCHANT and hence he will not be able to see any competiotion for that MERCHANT based to type of bussiness attribute. The ONLY way to open another MERCHANT with the same category of type of business is if that new MERCHANT also recruites the same customer. 
=================================================================================
===  branchName:blog == start:15Aug2018== Completed: 05 Oct 2018 ====
================================================================================= 
https://www.youtube.com/watch?v=2Dom1t1WVn0
- blog

=================================================================================
===  branchName:Adminpro == start:17Oct2018== Completed: 21Oct2018 ====
================================================================================= 
Administration Promotions:
first we start by updating/ amending merchant promotions which is done.
next we envisage that the app admin staff will need promotions data entry to 
1- maintain application promotions, such as:
      - general zario and merit point update for merchants and customers alike.
      - maintain general game promotions
      - maintain treasure hunt promotions.
2- maintain promotions on behalf of merchants.
=================================================================================
===  branchName:Customer-Promotions == start:22Oct2018== Completed: 31Oct2018 ====
================================================================================= 
   - promotions will display map of all MERCHANTS + logo card for each MERCHANT. 
   Promotions will also dsiplay dailies and weekly purchases that are special and daily achievements for each MERCHANT.
   - Once CUSTOMER clicks on map location or MERCHANT Card will get a display for MERCHANT details of basic promotions
   - when CUSTOMER press the ===MyPromotions=== button he gets same views with only the promotions he is subscribed to. The "You May Like This" MERCHANTS and promotions will also be displayed to teh CUSTOMER as a form of suggestive purchases. This will be an entry to AI.
=================================================================================
===  branchName:cart == start:01Nov2018== Completed: 99 Nov 2018 ====
================================================================================= 
- https://www.npmjs.com/package/qrcode is the npm module to use for qrcode generation 
- cart must read QR CODE from Mobile or Paper or Card =========>DONE
- Display customer information for the merchant =========>DONE
- allow merchant to enter amount of purchase =========>DONE 
- cart to display applicable promotions that can be either automatically assigned to purchase or merchant can force assign a promotion to purchase (service or product) =========>DONE
- promotions can be both application or merchant promotions =========>DONE
- discount will be applied to purchase and details of merits and zarios will be dispaled =========>DONE
- stored in data base as transaction table along with a reference to the applied promotions =========>DONE
- merchant must be able to add first time customers to the madd table then proceede to cart for that customer =========>DONE
- allow for 'MERCHANT' profile change =========>DONE
- make sure merchant has zarios on his record to be able to distribute them to customer as for his promotions. if he does not then we must change and not show the amount of zario in the propmotion when it exists.  =========>DONE
- there is also a matter of the calculation to award zarios according to the value added to the application for both customer and merchant. =========>DONE
- also make sure that the zarios distributed from the merchant to the customer are reduced from the merchant zario balance. =========>DONE
- update system par merchant profile and group records - as well as effect all the customer profile (application score, zarios) (merchant loyalty band).  zario transactions  =========>DONE
- emailed to customer
- 
- merchant can enter customer name and proceed with a cart transaction without customer being there to cater for some cases.
- visit promotions again to finalize the generated promotions and rethink how much freedom to give to merchants when creating promotions.
=================================================================================
===  branchName:+++++++ == start:01June2018== Completed: 99 June 2018 ====
================================================================================= 
- customer portfolio must be created when the user is created and for every customer. 
- allow merchant creation right at the start and allow for credentials and paper trail upload for proof of being a merchant.
- images and avatars must be totally changed to use aws strorage 
- on customer and merchant creation update the number of merchants and number of customers in the settings record
=================================================================================
===  branchName:Design == start:01June2018== Completed: 99 June 2018 ====
================================================================================= 
- once design is ready must incorporate color scheme 
- customer band progression and display of right logo for customer with the right color band
- select the text for the home page presentation 
=================================================================================
===  branchName:Wallet == start:01June2018== Completed: 99 June 2018 ====
================================================================================= 
   - Wallet design considerations and research. Wallet to allow purc hase of zario coins as well as show price of zario, ethereum, bitcoin on display
   - Wallet to show the amount of zarion and the transaction history for the CUSTOMER and MERCHANT that lead to this.
   - Wallet transafer to other Wallet addresses of zario coins can be entertained offline on the ethereum platform  if the CUSTOMER or MERCHANT makes that wish
   - MERCHANT purchases of zarios can be frozen by application and be used to promote treasure hunting for MERCHANT stores and locations or generally:"such as CUSTOMER finds zario coins that belong to MERCHANT, then he has to go to the store to be eliigable to collect".
   - use email double factor and OTP for contact us and sign on while extending sign on jwt to 3 months on mobile and one month on web
   =================================================================================
===  branchName:Dashboard == start:01June2018== Completed: 99 June 2018 ====
================================================================================= 
   - Dashboard menu option will show CUSTOMERS and MERCHANTS statistics such as:
      + system reputation band
      + Each MERCHANT reputation band for CUSTOMERS
      + various Zario Coin statistics
      + All CUSTOMERS for the MERCHANT with ab ility to send a message to their MY Profile page
      + CUSTOMER transactions with ech MERCHANT and his activity on the application
      + Achievements
      + 
   - use email and phone for double factor authentication.
   - Trasure Hunting on mobile, wallet, dashboard only and gaming. Along with download of app and registration, sign on etc..... 
   - 


<!-- coloring console.log in chrome =============================================
console.log('%c draftblog', 'background: #222; color: #bada55', this.draftblog);

link: https://stackoverflow.com/questions/7505623/colors-in-javascript-console

 -->