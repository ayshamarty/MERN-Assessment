const Validator = require("validator");
const isEmpty = require("./is-empty");

//module.exports = function validateLoginInput(data) {
    exports.userVal = function validateLoginInput(data) {
        let errors = {};
    
        data.username = !isEmpty(data.username) ? data.username : "";
        data.email = !isEmpty(data.email) ? data.email : "";
        data.password = !isEmpty(data.password) ? data.password : "";
      
      
        if (Validator.isEmpty(data.username)) {
          errors.username = "Username field is required";
        }
      
        if (Validator.isEmpty(data.email)) {
          errors.email = "Email field is required";
        }
      
        if (!Validator.isEmail(data.email)) {
          errors.email = "Please enter valid email";
        }

        if (Validator.isEmpty(data.password)) {
            errors.password = "Password field is required";
        }

        // if (Validator.isEmpty(data.verify)) {
        //     errors.verify = "Please verify your password";
        // }

        if (!Validator.equals(data.password, data.password2)) {
            errors.password = "Password fields must match";
        }

        return {
          errors,
          isValid: isEmpty(errors)
        };
      };