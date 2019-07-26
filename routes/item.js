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

// Ensure body contains:
// "username": username you signed up with
// "password": password you signed up with
// "id": must match "_id" of the item you wish to delete



router.delete("/delete", (req, res) => {
  const errors = {};
  const checkUsername = req.body.username;
  const checkPassword = req.body.password;

  let hashPassword;

  Users.findOne({ username: checkUsername })
    .then(user => {
      hashPassword = user.password;
      bcrypt
        .compare(checkPassword, hashPassword)
        .then(isMatch => {
          if (isMatch) {
            Items.deleteOne({
              _id: req.body.id
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
            res.status(404).json(errors);
          }
        })
        .catch(err => res.status(404).send(err));
    })
    .catch(() => res.status(404).json({ message: "verification failed: user or item does not exist " }));
});

// @routes POST item/create
// @desc Create item
// @access Public


// Ensure body contains:
// "username": username you signed up with
// "password": password you signed up with
// "content": some content to post

router.post("/create", (req, res) => {
  const errors = {};
  const item = new Items({
    username: req.body.username,
    content: req.body.content
  });
  const checkUsername = req.body.username;
  const checkPassword = req.body.password;

  const response = validator.itemVal(item);

  let hashPassword;

  Users.findOne({ username: checkUsername })
    .then(user => {
      hashPassword = user.password;
      bcrypt
        .compare(checkPassword, hashPassword)
        .then(isMatch => {
          if (isMatch) {
            if (response.isValid) {
              item.save();
              res.status(200).json({ message: "item added" });
            } else {
              res.status(404).json(response.errors);
            }
          } else {
            errors.checkPassword = "passwords do not match";
            res.status(404).json(errors);
          }
        })
        .catch(err => res.status(404).send(err));
    })
    .catch(() => res.status(404).json({ message: "user does not exist" }));
});

// @routes PUT item/update
// @desc Update item by ID
// @access Public


// Ensure body contains:
// "username": username you signed up with
// "password": password you signed up with
// "id": must match "_id" of the item you wish to update
// "content": content you would like to update with

router.put("/update", (req, res) => {
  const errors = {};
  const checkUsername = req.body.username;
  const checkPassword = req.body.password;

  let hashPassword;

  Users.findOne({ username: checkUsername })
    .then(user => {
      hashPassword = user.password;
      bcrypt
        .compare(checkPassword, hashPassword)
        .then(isMatch => {
          if (isMatch) {

              Items.updateOne(
                { _id: req.body.id },
                { $set: { content: req.body.content } }
              )
                .then(() => res.status(200).json({ message: "item updated" }))
                .catch(err => res.send(err));
          } else {
            errors.checkPassword = "passwords do not match";
            res.status(404).json(errors);
          }
        })
        .catch(err => res.status(404).send(err));
    })
    .catch(() => res.status(404).json({ message: "verification failed: user or item does not exist" }));
});



// router.put("/update", (req, res) => {
//   Items.updateOne({ _id: req.body.id }, { $set: { content: req.body.content } })
//     .then(() => res.status(200).json({ message: "item updated" }))
//     .catch(err => res.send(err));
// });

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



module.exports = router;
