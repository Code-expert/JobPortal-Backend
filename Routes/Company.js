import express from "express";
import {registerCompany,getCompanies,getCompanyById,updateCompany} from "../Controllers/Company.js";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { singleUpload } from "../Middlewares/multer.js";
const Router = express.Router();

Router.route('/register')
      .post(isAuthenticated,registerCompany);
Router.route('/get')
      .get(isAuthenticated,getCompanies);
Router.route('/get/:id')
      .get(isAuthenticated,getCompanyById);
Router.route('/update/:id')
      .put(isAuthenticated,singleUpload,updateCompany);      

export default Router;