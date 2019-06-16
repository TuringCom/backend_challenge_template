
/**
 * Tax controller contains methods which are needed for all tax request
 * Implement the functionality for the methods
 * 
 *  NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
class TaxController {
  /**
   * This method get all taxes
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAllTax(req, res, next) {
    // write code to get all tax from the database here
    return res.status(200).json({ message: 'this works' });
  }

  /**
   * This method gets a single tax using the tax id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getSingleTax(req, res, next) {
    
    // Write code to get a single tax using the tax Id provided in the request param
    return res.status(200).json({ message: 'this works' });
  }
}

export default TaxController;
