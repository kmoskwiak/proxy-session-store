const http = require('http');

module.exports = function(session) {
    let Store = session.Store;

    class httpStore extends Store {
        constructor(options) {
            super(session);
            this.options = {
                port: options.port || 80,
                hostname: options.hostname || 'localhost',
            };

            this.body = options.body || {};
        }

        _request(method, sessionData) {
            let data = {};
            for(let key in this.body) {
                data[key] = this.body[key];
            }

            data.method = method;
            data.body = sessionData;

            data = JSON.stringify(data);

            return new Promise((resolve, reject) => {
                let req = http.request({
                    method: 'POST',
                    port: this.options.port,
                    host: this.options.hostname,
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(data)
                    }
                }, (res) => {
                    let reply = '';
                    res.setEncoding('utf8');
    
                    res.on('data', (chunk) => {
                        reply = reply + chunk;
                    });
    
                    res.on('end', () => {
                        reply = reply || {};         
                        reply = JSON.parse(reply);
                        return resolve(reply);
                    });
    
                });
    
                req.end(data);
            });            
        }

        destroy(sid, cb) {
            this._request('destroy', {
                sid: sid
            })
                .then(() => {
                    return cb(null);
                })
                .catch((err) => {
                    return cb(err);
                });
        }

        get(sid, cb) {
            this._request('get', {
                sid: sid
            })
                .then((data) => {
                    return cb(null, data);
                })
                .catch((err) => {
                    return cb(err);
                });
        }

        set(sid, sess, cb) {
            this._request('set', {
                sid: sid,
                session: sess
            })
                .then(() => {
                    return cb(null);
                })
                .catch((err) => {
                    return cb(err);
                });

        }

    }

    return httpStore;
}