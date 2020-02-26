# Udagram Simple Frontend

Udagram is a simple cloud application developed along side the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed microservice, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](https://github.com/moboey/cloud-developer/tree/master/course-03/exercises/udacity-c3-frontend)
A basic Ionic client web application which consumes the RestAPI from two microservices, Feed and User
2. [The RestAPI Feed Backend](https://github.com/moboey/cloud-developer/tree/master/course-03/exercises/udacity-c3-restapi-feed), a Node-Express microservice which provides feed posting and retrieving services
3. [The RestAPI User Backend](https://github.com/moboey/cloud-developer/tree/master/course-03/exercises/udacity-c3-restapi-feed), a Node-Express microservice which provides user registration and login services
3. [The Image Filtering Microservice](https://github.com/moboey/cloud-developer/tree/master/course-02/project/image-filter-starter-code), the final project for the course. It is a Node-Express application which runs a simple script to process images.
***
## Docker image repositories
The docker images can be found here:
[moboey/reverseproxy](https://hub.docker.com/repository/docker/moboey/reverseproxy)
[moboey/udacity-frontend](https://hub.docker.com/repository/docker/moboey/udacity-frontend)
[moboey/udacity-restapi-user](https://hub.docker.com/repository/docker/moboey/udacity-restapi-user)
[moboey/udacity-restapi-feed](https://hub.docker.com/repository/docker/moboey/udacity-restapi-feed)

## Getting Setup

> _tip_: this frontend is designed to work with [The RestAPI Backend](https://github.com/grutt/udacity-c2-restapi). It is recommended you stand up the backend first, test using Postman, and then the frontend should integrate.

### Installing Node and NPM
This project depends on Nodejs and Node Package Manager (NPM). Before continuing, you must download and install Node (NPM is included) from [https://nodejs.com/en/download](https://nodejs.org/en/download/).

### Installing Ionic Cli
The Ionic Command Line Interface is required to serve and build the frontend. Instructions for installing the CLI can be found in the [Ionic Framework Docs](https://ionicframework.com/docs/installation/cli).

### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of this repository. After cloning, open your terminal and run:
```bash
npm install
```
>_tip_: **npm i** is shorthand for **npm install**

### Configure The Backend Endpoint
Ionic uses enviornment files located in `./src/enviornments/enviornment.*.ts` to load configuration variables at runtime. By default `environment.ts` is used for development and `enviornment.prod.ts` is used for produciton. The `apiHost` variable should be set to your server url either locally or in the cloud.

***
### Running the Development Server
Ionic CLI provides an easy to use development server to run and autoreload the frontend. This allows you to make quick changes and see them in real time in your browser. To run the development server, open terminal and run:

```bash
ionic serve
```

### Building the Static Frontend Files
Ionic CLI can build the frontend into static HTML/CSS/JavaScript files. These files can be uploaded to a host to be consumed by users on the web. Build artifacts are located in `./www`. To build from source, open terminal and run:
```bash
ionic build
```
***

## @TODO
2. Tasks
    i. Setup
        a. Clone, set up protected branches (dev, staging, master)
        b. NPM, Ionic CLI
        c. run tests (npm test), identify broken function, fix the function
        d. write tests for form validation and re-run tests
