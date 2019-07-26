const express = require("express");
const router = express.Router();

const Users = require("../models/userMod");
const validator = require("../validators/userVal");
const bcrypt = require("bcrypt");

// @routes GET user/getAll
// @desc Get all users
// @access Public

router.get("/getAll", (req, res) => {
    const errors = {};
  
    Users.find()
      .then(Users => {
        res.json(Users);
      })
      .catch((err) => {
        errors.findItems = err;
        res.status(404).json(errors);
      });
  });


  router.post("/create", (req, res) => {
    const user = new Users({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
  
    const response = validator.userVal(user);
  
    if (response.isValid) {
      payload = {};
  
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.save();
          res.status(200).json({ message: "User added" });
        });
      });
    } else {
      res.send(response.errors);
    }
  });




  module.exports = router;