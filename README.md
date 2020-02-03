# Web App for CSYE 6225

Web App to track bills of users.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to have NodeJs, SQL Server and Postman to run this app

On Linux to install Node JS use
```
$ sudo apt-get install nodejs
```

### Installing

You have to install all the dependencies in ```package.json``` by running the command

```
npm install
```



## Running the tests

To run tests

```
npm run test
```



This will check the post request


## Check the API on Postman

```
 POST  localhost:5000/v1/user/ #to create users
 GET   localhost:5000/v1/user/ #to update user
    
```
