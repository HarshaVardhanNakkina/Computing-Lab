## Setup
* cd into `apartment-management`
* run `npm install` (install nodejs if you haven't already)
* install mongodb if you haven't already, [Mongo installation](https://docs.mongodb.com/manual/installation/ "Mongo installation")
* run mongodb server and make sure it is online
* for testing purpose a cloud url, temporary api keys are provided in `.env.example` file, copy the contents into `.env` file, if you don't want to install mongodb
* those keys and url will be revoked, for further usage register your own cloud service and mail service and use them. We are not going to provide our keys and hosting service.
* If you have your own cloud and mail service, then create a .env file in the `apartment-management` directory
	* for local DataBase, put `DB_ENV='local'` and `MONGO_URI_LOCAL='mongodb://localhost:27017/apartmentmanagement'` in the .env file
	* for cloud DataBase, put `DB_ENV='cloud'` and `MONGO_URI_CLOUD='<cloud provider url>'` in the .env file
* run `npm run dev` to start the server
* in another tab run `npm run gulp` for compressing the `.js` and `.css` files
* for sending mails, signup for [MailJet](https://www.mailjet.com/ "MailJet") account and get the api keys
	* in the `.env` file create these entries
		* `MAILJET_USER='<your user key>'`
		*	`MAILJET_AUTH='<your auth key>'`