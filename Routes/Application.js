import express from "express";
import {applyJobs,getApplications,getAppliedJobs,updateStatus} from "../Controllers/Application.js";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
const Router = express.Router();

Router.route('/apply/:id')
      .get(isAuthenticated,applyJobs);
Router.route('/:id/applicants')
      .get(isAuthenticated,getApplications);
Router.route('/get')
      .get(isAuthenticated,getAppliedJobs);
Router.route('/status/:id/update')  
      .post(isAuthenticated,updateStatus);      

export default Router;
