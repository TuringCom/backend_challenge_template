/**
 * Customer controller handles all requests that has to do with customer
 * Some methods needs to be implemented from scratch while others may contain one or two bugs
 * 
 * - create - allow customers to create a new account
 * - login - allow customers to login to their account
 * - getCustomerProfile - allow customers to view their profile info
 * - updateCustomerProfile - allow customers to update their profile info like name, email, password, day_phone, eve_phone and mob_phone
 * - updateCustomerAddress - allow customers to update their address info
 * - updateCreditCard - allow customers to update their credit card number
 * 
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import { Customer } from '../database/models';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
/**
 *
 *
 * @class CustomerController
 */
class CustomerController {
  /**
   * create a customer record
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, customer data and access token
   * @memberof CustomerController
   */
  static async create(req, res, next) {
    // Implement the function to create the customer account
    const { name, email, password } = req.body;

    try {
      const customer = await Customer.findOne({
        where: {
          email,
        },
      });
      if (!customer) {
        // check if the customer with that email had registered before
        const passwordHash = bcrypt.hashSync(password, 10);
        const newCustomer = await Customer.upsert({
          name,
          email,
          password: passwordHash,
        });
        return res.status(201).send(newCustomer);
      }
      return res.status(409).json({
        error: {
          status: 409,
          message: `User with email ${email} already exist`,
        },
      });
    } catch (error) {
      return next(email);
    }
  }

  /**
   * log in a customer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, and access token
   * @memberof CustomerController
   */
  static async login(req, res, next) {
    // implement function to login to user account
    const { email, password } = req.body;
    try {
      const customer = await Customer.findOne({
        where: {
          email,
          password,
        },
      });
      const accessToken = `Bearer ${await jwt.sign(
        { customer_id: customer.customer_id },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
      )}`;
      if (customer) {
        return res.status(200).json({
          customer,
          accessToken,
          expiresIn: '24h',
        });
      }
      return res.status(404).json({
        error: {
          status: 404,
          message: `User does not exist`,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * log in a customer
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status, and access token
   * @memberof CustomerController
   */
  static async facebookLogin(req, res, next) {
    // implement function to login to user account
    const { accessToken } = req.body;
    try {
      const customer = await Customer.findOne({
        where: {
          accessToken,
        },
      });
      if (customer) {
        return res.status(200).json({
          customer,
          accessToken: null,
          expiresIn: null,
        });
      }
      return res.status(404).json({
        error: {
          status: 404,
          message: `User does not exist`,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get customer profile data
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async getCustomerProfile(req, res, next) {
    const accessToken = req.headers.authorization;
    const decodedToken = jwt.decode(accessToken.substring(7)); // remove the Bearer tag
    const customerId = decodedToken.customer_id;

    try {
      const customer = await Customer.findByPk(customerId);
      if (customer) {
        return res.status(200).json(customer);
      }
      return res.status(404).json('The user does not exist');
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer profile data such as name, email, password, day_phone, eve_phone and mob_phone
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomerProfile(req, res, next) {
    // Implement function to update customer profile like name, day_phone, eve_phone and mob_phone

    // eslint-disable-next-line camelcase
    const { email, name, day_phone, eve_phone, mob_phone } = req.body;
    const accessToken = req.headers.authorization;
    const decodedToken = jwt.decode(accessToken.substring(7)); // remove the Bearer tag
    const customerId = decodedToken.customer_id;
    try {
      await Customer.update(
        {
          email,
          name,
          day_phone,
          eve_phone,
          mob_phone,
        },
        {
          returning: true,
          where: {
            // eslint-disable-next-line prettier/prettier
          customer_id: customerId,
          },
        }
      );
      const customer = await Customer.findByPk(customerId);
      return res.status(200).json(customer);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer profile data such as address_1, address_2, city, region, postal_code, country and shipping_region_id
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCustomerAddress(req, res, next) {
    // write code to update customer address info such as address_1, address_2, city, region, postal_code, country
    // and shipping_region_id
    // eslint-disable-next-line camelcase
    const { address_1, address_2, city, region, postal_code, country, shipping_region_id } = req.body;
    const accessToken = req.headers.authorization;
    const decodedToken = jwt.decode(accessToken.substring(7)); // remove the Bearer tag
    const customerId = decodedToken.customer_id;
    try {
      await Customer.update(
        {
          address_1,
          address_2,
          city,
          region,
          postal_code,
          country,
          shipping_region_id,
        },
        {
          returning: true,
          where: {
            // eslint-disable-next-line prettier/prettier
          customer_id: customerId,
          },
        }
      );
      const customer = await Customer.findByPk(customerId);
      return res.status(200).json(customer);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * update customer credit card
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status customer profile data
   * @memberof CustomerController
   */
  static async updateCreditCard(req, res, next) {
    // write code to update customer credit card number
    // eslint-disable-next-line camelcase
    const { credit_card } = req.body;
    const accessToken = req.headers.authorization;
    const decodedToken = jwt.decode(accessToken.substring(7)); // remove the Bearer tag
    const customerId = decodedToken.customer_id;
    try {
      await Customer.update(
        {
          credit_card,
        },
        {
          returning: true,
          where: {
            // eslint-disable-next-line prettier/prettier
          customer_id: customerId,
          },
        }
      );
      const customer = await Customer.findByPk(customerId);
      return res.status(200).json(customer);
    } catch (error) {
      return next(error);
    }
  }
}

export default CustomerController;
