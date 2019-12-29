/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

class Validation {
  static validationCheck(req, res, next) {
    const errors = validationResult(req);
    req = { ...req, ...matchedData(req) };

    if (!errors.isEmpty()) {
      const mappedErrors = Object.entries(errors.mapped()).reduce((acc, [key, value]) => {
        acc[key] = value.msg;
        return acc;
      }, {});
      const errorResult = res.status(400).json({ status: 400, error: mappedErrors });
      return errorResult;
    }
    next();
  }
}
export default Validation;
