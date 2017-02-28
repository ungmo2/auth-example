var express = require('express');
var router  = express.Router();

var User = require('../models/user');

// Create user
router.post('/', function(req, res) {
  User.create(req.body, function (err, users) {
    if(err) return res.status(500).send(err);
    res.send('User Create successfully:\n' + users);
  });
});

// Find All
router.get('/', function(req, res) {
  User.find({ }, function(err, users) {
    if(err)           return res.status(500).send(err);
    if(!users.length) return res.status(404).send({ err: 'User not found' });
    res.send('User find successfully:\n' + users);
  });
});

// Find One
router.get('/username/:username', function(req, res) {
  User.findOne({ 'username' : req.params.username }, function(err, user) {
    if(err)   return res.status(500).send(err);
    if(!user) return res.status(404).send({ err: 'User not found' });
    res.send('User findOne successfully:\n' + user);
  });
});

// FIND AND UPDATE
router.put('/username/:username', function(req, res) {
});

// REMOVE ALL
router.delete('/', function(req, res) {
  User.remove({ }, function(err) {
    if(err) return res.status(500).send(err);
    res.send('User all deleted successfully');
  });
});

// FIND AND REMOVE
router.delete('/username/:username', function(req, res) {
  User.remove({ username: req.params.username }, function(err) {
    if(err) return res.status(500).send(err);
    res.send('User deleted successfully');
  });
});

module.exports = router;
