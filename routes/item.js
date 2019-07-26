const express = require("express");
const router = express.Router();
const Items = require("../models/itemMod");
const Users = require("../models/userMod");
const validator = require("../validators/itemVal");
const bcrypt = require("bcrypt");

const _ = require("lodash");

// @routes GET item/all
// @desc Get all items
// @access Public

router.get("/getAll", (req, res) => {
  const errors = {};

  Items.find({}, "-email -__v")
    .then(items => {
      res.json(items);
    })
    .catch(err => {
      res.status(404).json(errors);
    });
});


// @routes Delete item/delete
// @desc Delete item by ID
// @access Public

router.delete("/delete", (req, res) => {
  errors = {};
  
  const checkPassword =req.body.password;
  const checkUsername = req.body.username;
  const checkID = req.body.itemID;
  let hashPassword;

  Users.findOne( {username : checkUsername} )
  .then( user => {
   hashPassword = item.password;

   bcrypt.compare(checkPassword, hashPassword).then(isMatch => {
    if (isMatch) {
      Items.deleteOne({
        _id: req.body.itemID
      })
        .then(({ ok, n }) => {
          if (n === 0) {
            errors.noDelete = "item not deleted";
            res.status(404).json(errors);
          }
          res.status(200).json({ message: "item deleted" });
        })
        .catch(err => {
          res.send(err);
        });
    } else {
      errors.checkPassword = "passwords do not match";
      errors.first = checkPassword;
      errors.second = hashPassword;
      res.status(404).json(errors);
    }
  }).catch((err) => res.status(404).send(err));
}).catch(() => res.status(404).json({message :"user does not exist"}));
});



// @routes POST item/create
// @desc Create item
// @access Public

router.post("/create", (req, res) => {
  const errors ={};
  const item = new Items({
    username: req.body.username,
    content: req.body.content
  });
  const checkUsername = req.body.username;
  const checkPassword =req.body.password;
  
  const response = validator.itemVal(item);
  
  let hashPassword;
  
  Users.findOne( {username : checkUsername} )
  .then( user => {
   hashPassword = user.password;
   bcrypt.compare(checkPassword, hashPassword).then(isMatch => {
    if (isMatch) {
      
      if (response.isValid) {
        item.save();
        res.status(200).json({ message: "item added" });
  } else{
    res.status(404).json(response.errors)
  }

    } else {
      errors.checkPassword = "passwords do not match";
      res.status(404).json(errors);
    }
  }).catch((err) => res.status(404).send(err));
  }).catch(() => res.status(404).json({message :"user does not exist"}));

});

// @routes PUT item/update
// @desc Update item
// @access Public

router.put("/update", (req, res) => {
  Items.updateOne(
    { username: req.body.username },
    { $set: { content: req.body.content } },
    { $set: { email: req.body.email } }
  )
    .then(() => res.status(200).json({ message: "item updated" }))
    .catch(err => res.send(err));
});



// @route POST decrypt
// @desk check matching value
// @access Public

router.post("/check", (req, res) => {
  errors = {};

  const checkEmail = req.body.email;
  const checkUsername = req.body.username;
  let hashEmail;

  Items.findOne({ username: checkUsername }).then(item => {
    hashEmail = item.email;

    bcrypt
      .compare(checkEmail, hashEmail)
      .then(isMatch => {
        if (isMatch) {
          res.json({ message: "emails match" });
        } else {
          errors.checkEmail = "emails do not match";
          errors.first = checkEmail;
          errors.second = hashEmail;
          res.status(404).json(errors);
        }
      })
      .catch(err => res.status(404).send(err));
  });
});

//compare email values

module.exports = router;
