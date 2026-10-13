/**
 * dataSource.js — Single place that decides where data comes from.
 *
 * Default: dummy data from mockApi.js (no backend needed).
 * To use the real backend, set REACT_APP_USE_MOCK=false in frontend/.env
 * and restart `npm start`. No page code has to change.
 */

import * as mock from './mockApi';
import * as real from './api';

export const USING_MOCK = process.env.REACT_APP_USE_MOCK !== 'false';

const source = USING_MOCK ? mock : real;

export const authorize    = source.authorize;
export const getHealth    = source.getHealth;
export const getSummary   = source.getSummary;
export const getOrders    = source.getOrders;
export const getProducts  = source.getProducts;
export const getCustomers = source.getCustomers;
export const getCities    = source.getCities;
