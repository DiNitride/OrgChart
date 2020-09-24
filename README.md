# Organisation Chart

A simple Organisation Chart, with a backend API writting in PHP using Symfony, and a frontend 

### TODO
- Tests
- Create Employee dialogue
- Error feedback

### Issues
- Swapping employees while keeping children sometimes fails where it shouldn't, where a swapped employee would demote but it would not break heirachy
- Swapping breaks if you swap a child and parent, it simply obliterates both out of existence

### Setup: API Backend
##### Prerequisites
- MongoDB
- PHP 7+ (inc composer)
- Symfony PHP Framework

##### Install
```
> git clone www.github.com/DiNitride/OrgChart
> cd OrgChart/api
```
##### Mongo
The easiest way is to just spin up an instance in docker
```
> docker pull mongo
> docker run --name mongo-db -d -p 27017:27017 -v ~/mongo-data:/data/db mongo
```
To restart Mongo after a reboot etc.
`> docker run mongo-db`

or alternatively, just use a normal Mongo install and configure the API to use it.

<sub>See [here](https://hub.docker.com/_/mongo) for more information on Mongo in Docker</sub>

##### PHP & Symfony
1. Install PHP via your package manager or however you do it in Windows
2. Install the Symfony CLI either from their website or via your package manager if available
3. Install PHP requirements
```
> composer require annotations
> composer require doctrine/mongodb-odm-bundle
```
<sub>See [here](https://symfony.com/doc/current/setup.html) for further details on Symfony setup</sub>

##### Configure
Configure the Mongo URL and DB name.
```
# OrgChart/api/config/services.yaml
parameters:
    env(MONGODB_URL): 'mongodb://localhost:27017'
    env(MONGODB_DB): 'org-chart'
```

<sub>See [here](https://symfony.com/doc/master/bundles/DoctrineMongoDBBundle/installation.html#install-the-bundle-with-composer) for further details on MongoDB Driver setup</sub>

##### Run
For Development
```
> cd OrgChart/api
> symfony server:start
```
Make requests to `localhost:8000`

See [Symfony Documentation](https://symfony.com/doc/current/index.html) for Production deployment

### Setup: Frontend
##### Prerequisites
- NodeJS
- npm

##### Install
```
> git clone www.github.com/DiNitride/OrgChart
> cd OrgChart/web
> npm install
```

##### Run
This will start the Mongo instance in Docker, start the Symfony server, then boot the React app.
```
npm start
```