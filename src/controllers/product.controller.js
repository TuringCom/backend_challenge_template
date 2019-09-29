/**
 * The Product controller contains all static methods that handles product request
 * Some methods work fine, some needs to be implemented from scratch while others may contain one or two bugs
 * The static methods and their function include:
 * 
 * - getAllProducts - Return a paginated list of products
 * - searchProducts - Returns a list of product that matches the search query string
 * - getProductsByCategory - Returns all products in a product category
 * - getProductsByDepartment - Returns a list of products in a particular department
 * - getProduct - Returns a single product with a matched id in the request params
 * - getAllDepartments - Returns a list of all product departments
 * - getDepartment - Returns a single department
 * - getAllCategories - Returns all categories
 * - getSingleCategory - Returns a single category
 * - getDepartmentCategories - Returns all categories in a department
 * 
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
import {
  Product,
  ProductCategory,
  Review,
  Department,
  AttributeValue,
  Attribute,
  Category,
  Customer,
  Sequelize,
} from '../database/models';

const { Op } = Sequelize;

/**
 *
 *
 * @class ProductController
 */
class ProductController {
  /**
   * get all products
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getAllProducts(req, res, next) {
    const { query } = req;
    // eslint-disable-next-line camelcase
    let { page, limit, description_length } = query;
    if (!page) {
      page = 1;
    } else if (page < 1) {
      page = 1;
    };
    if (!limit) {
      limit = 20;
    }
    // eslint-disable-next-line camelcase
    if (!description_length) {
      // eslint-disable-next-line camelcase
      description_length = 200;
    }
    const offset = Number(page) * Number(limit) - Number(limit);
    const maximum = offset + Number(limit);
    const sqlQueryMap = {
      offset,
      limit: Number(limit),
    };
    const paginationMeta = {
      currentPage: offset,
      currentPageSize: limit,
    };
    try {
      const products = await Product.findAndCountAll(sqlQueryMap);
      return res.status(200).json({
        paginationMeta,
        products,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * search all products
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async searchProduct(req, res, next) {
    const { query_string, all_words } = req.query;  // eslint-disable-line
    // all_words should either be on or off
    // implement code to search product
    return res.status(200).json({ message: 'this works' });
  }

  /**
   * get all products by category
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getProductsByCategory(req, res, next) {

    try {
      const { query, params } = req;
      const { category_id } = params; // eslint-disable-line
      let { page, limit, description_length } = query;
      const offset = Number(page) * Number(limit) - Number(limit);
      if (!page) {
        page = 1;
      } else if (page < 1) {
        page = 1;
      }
      if (!limit) {
        limit = 20;
      }
      const products = await ProductCategory.findAll({
        where: {
          category_id,
        },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: [
              'product_id',
              'name',
              'description',
              'price',
              'discounted_price',
              'thumbnail',
            ],
          },
        ],
        raw: true,
        attributes: [],
        limit: Number(limit),
        offset,
      });
      return res.status(200).json({
        rows: products,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all products by department
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getProductsByDepartment(req, res, next) {
    // implement the method to get products by department
    try {
      const { query, params } = req;
      const { department_id } = params; // eslint-disable-line
      let { page, limit, description_length } = query;
      const offset = Number(page) * Number(limit) - Number(limit);
      if (!page) {
        page = 1;
      } else if (page < 1) {
        page = 1;
      }
      if (!limit) {
        limit = 20;
      }
      const categoryIDs = await Category.findAll({
        where: {
          department_id,
        },
        attributes: ['category_id'],
        limit: Number(limit),
        offset,
      });
      const departmentalProducts = [];
      const categoriesIDArray = [];
      categoryIDs.map(id => categoriesIDArray.push(id.category_id));

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < categoriesIDArray.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const products = await ProductCategory.findAll({
          where: {
            category_id: categoriesIDArray[i],
          },
          include: [
            {
              model: Product,
              as: 'product',
              attributes: [
                'product_id',
                'name',
                'description',
                'price',
                'discounted_price',
                'thumbnail',
              ],
            },
          ],
          attributes: [],
        });
        if (products) {
          departmentalProducts.push(products);
        }
      }

      return res.status(200).json({
        rows: departmentalProducts,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get single product details
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product details
   * @memberof ProductController
   */
  static async getProduct(req, res, next) {
    const { query, params } = req;
    // eslint-disable-next-line camelcase
    let { description_length } = query;
    const { product_id } = params;  // eslint-disable-line
    try {
      const product = await Product.findByPk(product_id);
      if (product) {
        return res.status(200).json(product);
      }
      return res.status(404).json({
        error: {
          status: 404,
          message: `Product with id ${product_id} does not exist`,  // eslint-disable-line
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all reviews for a product
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async getProductReviews(req, res, next) {
    const { product_id } = req.params;  // eslint-disable-line
    try {
      const reviews = await Review.findAll({
        where: {
          product_id,
        },
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['name'],
          },
        ],
        raw: true,
        attributes: [],
      });
      if (reviews) {
        return res.status(200).json(reviews);
      }
      return res.status(404).json({
        error: {
          status: 404,
          message: `Product with id ${product_id} does not exist`,  // eslint-disable-line
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * post a product review
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and product data
   * @memberof ProductController
   */
  static async postProductReview(req, res, next) {
    const { product_id, review, rating } = req.params;  // eslint-disable-line
    try {
      const product = await Product.findOne({
        where: {
          product_id,
        },
      });
      if (product) {
        // check if the customer had reviewed the product before
        const customerReview = await Review.findOne({
          where: {
            product_id,
            customer_id: 1,
          },
          attributes: ['review_id'],
        });

        if (!customerReview) {
          const productReview = await Review.upsert({
            customer_id: 1,
            review,
            rating,
            created_on: Date.now(),
            product_id: parseInt(product_id, 10),
          });
          return res.status(201).send(productReview);
        }
        return res.status(409).json('You have already reviewed this product.');
      }
      return res.status(404).json({
        error: {
          status: 404,
          message: `Product with id ${product_id} does not exist`,  // eslint-disable-line
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all departments
   *
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {json} json object with status and department list
   * @memberof ProductController
   */
  static async getAllDepartments(req, res, next) {
    try {
      const departments = await Department.findAll();
      return res.status(200).json(departments);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get a single department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getDepartment(req, res, next) {
    const { department_id } = req.params; // eslint-disable-line
    try {
      const department = await Department.findByPk(department_id);
      if (department) {
        return res.status(200).json(department);
      }
      return res.status(404).json({
        error: {
          status: 404,
          message: `Department with id ${department_id} does not exist`,  // eslint-disable-line
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get all categories
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAllCategories(req, res, next) {
    // Implement code to get all categories here
    try {
      const categories = await Category.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get a single category using the categoryId
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getSingleCategory(req, res, next) {
    const { category_id } = req.params; // eslint-disable-line
    try {
      const category = await Category.findByPk(category_id);
      if (category) {
        return res.status(200).json(category);
      }
      return res.status(404).json({
        error: {
          status: 404,
          message: `Category with id ${category_id} does not exist`,  // eslint-disable-line
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method should get list of categories in a department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getDepartmentCategories(req, res, next) {
    try {
      const { department_id } = req.params; // eslint-disable-line
      const categories = await Category.findAll({
        where: {
          department_id,
        },
      });
      return res.status(200).json(categories);
    } catch (error) {
      return next(error);
    }
  }
}

export default ProductController;
