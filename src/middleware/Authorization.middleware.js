import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * @class Authorization
 */
export default class Authorization {
  /**
   * @method verifyToken
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @returns {object} status and message
   *
   */
  static verifyToken(req, res, next) {
    const BearerToken =
      req.headers.authorization || req.headers['x-auth-token'] || req.headers.Authorization;
    const token = BearerToken && BearerToken.replace('Bearer ', '');
    if (!token) res.status(403).res.json({ status: 403, message: 'Please provide a token' });

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res
            .status(401)
            .json({ status: 401, error: 'User authorization token is expired' });
        }
        return res.status(401).json({ status: 401, error: 'Invalid token' });
      }
      req.decoded = decoded;
      next();
    });
  }

  /**
   * @method generateToken
   *
   * @param {object} payload
   *
   * @returns {string} JWT
   */
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1day' });
  }

  /**
   * @method hashPassword
   *
   * @param {string} myPlaintextPassword
   *
   * @returns {string} encryptedpassword
   */
  static hashPassword(myPlaintextPassword) {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(myPlaintextPassword, salt);
  }

  /**
   * @method comparePassword
   *
   * @param {string} password
   * @param {string} hash
   *
   * @returns {string} hashPassword
   */
  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}
