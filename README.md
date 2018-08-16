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
===  branchName:MerchantAddCustomer == start:02Aug2018== Completed: 99 June 2018 ====
================================================================================= 
   - MERCHANT can record a CUSTOMER to the application. Along with the recording of customer transactions on the system.
   - This CUSTOMER will be flaged as recruited by that MERCHANT and hence he will not be able to see any competiotion for that MERCHANT based to type of bussiness attribute. The ONLY way to open another MERCHANT with the same category of type of business is if that new MERCHANT also recruites the same customer. 
=================================================================================
===  branchName:Customer-Promotions == start:01June2018== Completed: 99 June 2018 ====
================================================================================= 
   - promotions will display map of all MERCHANTS + logo card for each MERCHANT. Promotions will also dsiplay dailies and weekly purchases that are special and daily achievements for each MERCHANT.
   - Once CUSTOMER clicks on map location or MERCHANT Card will get a display for MERCHANT details of basic promotions
   - when CUSTOMER press the ===MyPromotions=== button he gets same views with only the promotions he is subscribed to. The "You May Like This" MERCHANTS and promotions will also be displayed to teh CUSTOMER as a form of suggestive purchases. This will be an entry to AI.

   - blog
   - Wallet design considerations and research. Wallet to allow purc hase of zario coins as well as show price of zario, ethereum, bitcoin on display
   - Wallet to show the amount of zarion and the transaction history for the CUSTOMER and MERCHANT that lead to this.
   - Wallet transafer to other Wallet addresses of zario coins can be entertained offline on the ethereum platform  if the CUSTOMER or MERCHANT makes that wish
   - MERCHANT purchases of zarios can be frozen by application and be used to promote treasure hunting for MERCHANT stores and locations or generally:"such as CUSTOMER finds zario coins that belong to MERCHANT, then he has to go to the store to be eliigable to collect".
   - use email double factor and OTP for contact us and sign on while extending sign on jwt to 3 months on mobile and one month on web
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


==========add-db-Models=======git branch============
   - add all db structures and models for your data
==========add-design-home=======git branch============