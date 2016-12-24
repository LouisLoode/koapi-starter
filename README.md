# Starter KoApi
[![Build Status](https://travis-ci.com/LouisLoode/api-secret-project.svg?token=n8ypVfKXj784sbsPxH3b&branch=master)](https://travis-ci.com/LouisLoode/api-secret-project)

### Version
0.0.2

### Description
KoApi is a starter for an robust API.
  - CRUD example
  - User account ready
  - Add Code Comments
  - Doc-ready
  - Worker Ready
  - Travis Building
  - PM2 ready

### Tech
KoApi uses a number of open source projects to work properly:
* [node.js] - evented I/O for the backend

And of course Dillinger itself is open source with a [public repository][KoApi]
 on GitHub.

### Installation

You need to install NodeJS dependancies:
```sh
$ sudo npm install
```

Need to copy and configure the config file:
```sh
$ cp ./config/env/development.js ./config/env/production.js
```

Run app in dev mode (need [Nodemon]):
```sh
$ nodemon app.js
```

Run worker in dev mode (need [Nodemon]):
```sh
$ nodemon worker.js
```

Run app in prod mode (need [PM2]):
```sh
$ npm start
```

Close app in prod mode (need [PM2]):
```sh
$ npm stop
```

### Run test units
```sh
$ npm test
```

### Generate documentation
```sh
$ apidoc -i ./api/controllers/ -o ./doc/dist/ -t ./doc/template/
```


### Todos
 - Logger strategy (winston)

License
----

NEED TO CHOOSE


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [KoApi]: <https://github.com/LouisLoode/StarterKoApi>
   [Nodemon]: <https://www.npmjs.com/package/nodemon>
   [node.js]: <http://nodejs.org>
