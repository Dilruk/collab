var Hapi = require('hapi');
var Good = require('good');
var constants = require('./constants');
var format = require('string-format');
var Routes = require('./routes');
var config = require('config');
var privateKey = config.get('authentication.privateKey');
console.log('NODE_ENV:' + process.env.NODE_ENV);

// Create a server with a host and port
var server = new Hapi.Server();
require('babel-core/register')({
  presets: ['react', 'es2015']
});

server.connection({
  port: 8081,
  labels: ['api']
});

server.connection({
  port: 8080,
  labels: ['collaboration']
});

// Token-based authentication validation function
var validate = function(decodedToken, request, callback) {
  var diff = Date.now() / 1000 - decodedToken.iat;
  if (diff > decodedToken.expiresIn) {
    return callback(null, false);
  }
  callback(null, true, decodedToken);
};

const serverPlugins = [
  require('vision'),
  require('inert'),
  require('hapi-auth-jwt2'),
  require('./controller/socket')
];

if (process.env.NODE_ENV !== 'test') {
  serverPlugins.push({
    register: Good,
    options: {
      reporters: [{
        reporter: require('good-console'),
        events: {
          response: '*',
          log: '*',
        },
      }],
    },
  });
}

server.register(serverPlugins, function(err) {
  if (err) {
    console.log(err);
  }
  server.auth.strategy('jwt', 'jwt', {
    validateFunc: validate,
    key: privateKey,
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  server.auth.default('jwt');

  server.views({
    engines: {
      jsx: require('hapi-react-views'),
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'views'
  });
  server.state('config', {
    ttl: null,
    isSecure: false,
    isHttpOnly: false,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265

  });
  server.route(Routes.endpoints);


  server.start(function(err) {
    if (err) {
      throw err;
    }
    console.log(__dirname);
    console.log('Server is listening at ' + server.select('api').info.uri);
    console.log('Server is listening at ' + server.select('collaboration').info.uri);
  });
});

module.exports = server;
