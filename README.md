# HTTP Proxy Session Store

Proxy session store for `express-session` allows to use any session store through http API.

It can be used to:
* share any session store between multiple applications,
* reach session store through HTTP Api

![Proxy Session Store](https://raw.githubusercontent.com/kmoskwiak/files/master/proxy-session-store/proxy-session-store.png)

## Setup
```
npm install proxy-session-store
```

In express app:

```js
var session = require('express-session');
var ProxySessionStore = require('proxy-session-store')(session);

app.use(session({
           store: new ProxySessionStore({
               port: 9999,
               hostname: 'localhost',
               body: {
                   apiKey: '<api_key>',
                   someOtherOptionalKey: 'which you want to pass to session store'
               }
           }),
           secret: 'keyboard cat'
       }
   ));
```

In above example Proxy Session Store will send `POST` request to server listening on `http://localhost:9999`. Body of `POST` request in this example looks like this:

```js
{
   apiKey: '<api_key>',
   someOtherOptionalKey: 'which you want to pass to session store',
   body: 'SESSION DATA'
}
```

## Avaliable options
* `port` - port of service with exposed HTTP API
* `hostname` - hostname of service with exposed HTTP API
* `body` - OPTIONAL - any additional data which should be send in HTTP request


