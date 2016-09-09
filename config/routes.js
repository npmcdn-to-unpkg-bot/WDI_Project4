var router = require('express').Router();
var jwt = require('jsonwebtoken');
var secret = require('../config/tokens').secret;
var usersController = require('../controllers/users');
var authController = require('../controllers/authentications');

function secureRoute(req, res, next) {
  if(!req.headers.authorization) 
    return res.status(401).json({ message: "Unauthorized" });

  var token = req.headers.authorization.replace('Bearer ', '');
  jwt.verify(token, secret, function(err, payload) {
    if(err || !payload) 
      return res.status(401).json( { message: "Unauthorized" });

    req.user = payload;
    next();
  });
}

router.route('/users')
  .all(secureRoute)
  .get(usersController.index)
  .post(usersController.create);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;