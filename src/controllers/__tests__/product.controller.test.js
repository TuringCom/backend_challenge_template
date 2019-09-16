// eslint-disable-next-line import/no-extraneous-dependencies
import '@babel/polyfill';
import request from 'supertest';

import app, { server } from '../..';
import { Product, Department } from '../../database/models';
import truncate from '../../test/helpers';

describe('product controller', () => {
  let product;
  let department;
  beforeEach(async done => {
    await truncate();
    product = await Product.create({
      name: 'New T shirt',
      description: 'Simple T shirt',
      price: 14.99,
    });
    department = await Department.create({
      name: 'Groceries',
      description: 'Daily groceries',
    });
    done();
  });

  afterAll(async done => {
    server.close();
    done();
  });

  describe('getAllProducts', () => {
    it('should return a list of products', done => {
      request(app)
        .get('/products?page=3&search=the&limit=30')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(typeof res.body).toHaveProperty('rows');
          expect(typeof res.body).toHaveProperty('pagination');
          done();
        });
    });
  });

  describe('getProduct', () => {
    it('should get the details of a product', done => {
      request(app)
        .get(`/products/${product.product_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('product_id');
          done();
        });
    });

    it('should return appropriate status if product is not found', done => {
      request(app)
        .get('/products/999999')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });

  describe('getAllDepartments', () => {
    it('should return a list of departments', done => {
      request(app)
        .get('/departments')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(typeof res.body).toEqual('object');
          done();
        });
    });
  });

  describe('getDepartment', () => {
    it('should get the details of a department', done => {
      request(app)
        .get(`/departments/${department.department_id}`)
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('department_id');
          done();
        });
    });

    it('should return appropriate status if department is not found', done => {
      request(app)
        .get('/departments/999999')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });
});
