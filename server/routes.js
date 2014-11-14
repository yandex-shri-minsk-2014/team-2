'use strict';

var passport = require('passport');

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('signin');
  });

  app.post('/local-auth', passport.authenticate('local-signin', {
      successRedirect: '/qwe',
      failureRedirect: '/'
    })
  );

  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  app.post('/local-reg', passport.authenticate('local-signup', {
      successRedirect: '/qwe',
      failureRedirect: '/signup'
    })
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/:id', ensureAuthenticated, function(req, res) {
    if (!req.user) {
      res.redirect('/');
    } else {
      var name = req.user.name;
      res.render('index', {user: name});
      // res.sendFile(path.resolve('build/index.html'));
    }
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.error = 'Please sign in!';
    res.redirect('/');
  }
};
