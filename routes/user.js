const express = require("express");
const router = express.Router();

const Users = require("../models/userMod");
const validator = require("../validators/userVal");
const bcrypt = require("bcrypt");

// @routes GET user/getAll
// @desc Get all users
// @access Public
// for development ONLY


// router.get("/getAll", (req, res) => {
// const errors = {};

//  Users.find({}, 
//    "-password2 -__v -password -id"
//    )
//    .then(Users => {
//      res.json(Users);
//    })
//    .catch(err => {
//      errors.findUsers = err;
//      res.status(404).json(errors);
//    });
//  });

// @routes GET user/login
// @desc User login
// @access Public

router.get("/login", (req,res) => {
    const errors = {};
  
  const checkUsername = req.body.username;
  const checkPassword =req.body.password;
  let hashPassword;
  
  Users.findOne( {username : checkUsername} )
  .then( user => {
   hashPassword = user.password;
  
   bcrypt.compare(checkPassword, hashPassword).then(isMatch => {
    if (isMatch) {
      res.status(400).json({message :"login successful"})
    } else {
      errors.checkPassword = "incorrect password";
      res.status(404).json(errors);
    }
  }).catch((err) => res.status(404).send(err));
  }).catch(() => res.status(404).json({message :"user does not exist"}));
    
  })



// @routes POST user/create
// @desc Create user
// @access Public

router.post("/create", (req, res) => {

  
  const user = new Users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    password2: req.body.password2
  });

  const response = validator.userVal(user);

  if (response.isValid) {
    payload = {};

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        user.password = hash;
        user.password2 = hash;
        user.save().then(() => {
            payload.message = "User added";
            res.status(404).json(payload);
        }).catch((err)=> {
            payload.message = "A user with that username or email already exists";
            res.status(404).json(payload);
        });
      });
    });
  } else {
    res.send(response.errors);
  }
});

// @routes Delete user/delete
// @desc Delete user by ID
// @access Public

router.delete("/delete", (req, res) => {
  const errors = {};

  Users.deleteOne({
    _id: req.body.id
  })
    .then(({ ok, n }) => {
      if (n === 0) {
        errors.noDelete = "user not deleted";
        res.status(404).json(errors);
      }
      res.status(200).json({ message: "user deleted" });
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
