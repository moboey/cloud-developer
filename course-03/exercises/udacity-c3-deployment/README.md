# udacity-c2-deployment

This package contains deployment scripts to deploy the udagram front end and backend microservices into docker or kubernetes

***
## Getting Setup

First build your applications. You can find instructions on how to build the application in the README file of the respective application folders. 

#### 1. Docker
Ensure you have a docker installed on your development environment. The backend services will require several environment variables to be defined. You can view the list of the required environment variables in the docker-compose.yaml file. 

To perform the docker build, use the following command:`docker-compose up`

#### 2. Kubernetes
There are basically 3 types of files here: configuration, deployment and service files. The configuration files are the aws-secret, env-configmap and env-secret files. The deployment files are in the format `<applicationname>-deployment.yaml`. Lastly the service files are in the format `<applicationname>-service.yaml`. 

Ensure you have a Kubernetes  (i.e kubectl) installed on your development environment. The backend services will require several environment variables to be defined. You can view the list of the required variables in the aws-secret.yaml, env-secret.yaml,env-configmap.yaml file. 

You will need to apply the configuration and secret files first with the following commands:`kubectl apply -f \.aws-secret.yaml`. You will need to perform this for aws.secret yaml, env-secret.yaml, env-configmap.yaml files.

Once the configurations are applied, run the following command to deploy the application to kubernetes: `kubectl apply -f .\backend-feed-deployment.yaml`. Repeat this for all the remaining deployment yaml files. 

Lastly, apply the service configuration to kubernetes with the command:`kubectl apply -f .\backend-feed-service.yaml`. Repeat this for the remaining services yaml files. 

To check the status of your kubernetes pods, use the following command : `kubectl get pods`

      