import express from "express";
import {createJob,getJobs,getJobById,getAdminsJobs} from "../Controllers/Job.js";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
const Router = express.Router();

Router.route('/create')
      .post(isAuthenticated,createJob);
Router.route('/get')
      .get(isAuthenticated,getJobs);
Router.route('/get/:id')
      .get(isAuthenticated,getJobById);
Router.route('/admin/job')
      .get(isAuthenticated,getAdminsJobs);
// Router.route('/update/:id')
//       .put(isAuthenticated,updateJob);      

export default Router;