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

  Users.find({}, 
    '-password2'
    )
    .then(Users => {
      res.json(Users);
    })
    .catch(err => {
      errors.findUsers = err;
      res.status(404).json(errors);
    });
});

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

// @routes Delete user/delete
// @desc Delete user by ID
// @access Public

router.delete("/deleteID", (req, res) => {
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
