import express from 'express';

// Controllers
import departmentController from '../controllers/departmentController';

// Middlewares
import validator from '../middlewares/validator';

const departmentRouter = express.Router();

// Route for getting departments
departmentRouter.get('/departments',
  departmentController.getAllDepartments);

// Route for getting department by id
departmentRouter.get('/departments/:id',
  validator.validateDepartmentId,
  departmentController.getDepartment);


export default departmentRouter;
