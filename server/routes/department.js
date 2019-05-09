import express from 'express';

// Controllers
import departmentController from '../controllers/departmentController';

const departmentRouter = express.Router();

// Route for getting departments
departmentRouter.get('/departments',
  departmentController.getAllDepartments);

// Route for getting order by id
departmentRouter.get('/departments/:id',
  departmentController.getDepartment);


export default departmentRouter;
