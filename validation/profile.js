const Validator = require('validator');

module.exports = validateProfileInput = (data) => {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 40 })) {
    errors.name = 'Name must be between 2 and 40 characters';
  }

  return {
    errors,
  };
};
