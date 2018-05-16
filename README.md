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
===  branchName: added-security== start:29April2018== Completed: 99May 2018 ====
================================================================================= 
   - start working on the client side in  order to make testing simpler and easier for server security checks
   - on clients do register + sign in / out + Password Change + Forget Password with mailer
   - email notifications for any activity on security (1-confirm email on registration by sendinga code. 2- password change notification. 3-Forget Password and Reset notifications.)
   - Route authentication for each user type:{Administrator, Customer, Merchant}. Display correct menu for each type. 
   - use email and phone for double factor authentication.

500 - Internal Server Error {"err":"MongoError: E11000 duplicate key error collection: zario.users index: email_1 dup key: { : \"jasemqabazard@gmail.com\" } user save error"}
500 - Internal Server Error {"err":{"name":"UserExistsError","message":"A user with the given username is already registered"}}
   
==========add-db-Models=======git branch============
   - add all db structures and models for your data
==========add-design-home=======git branch============