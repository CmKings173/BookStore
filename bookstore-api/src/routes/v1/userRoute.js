import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddeware'
const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .get(userController.refreshToken)

Router.route('/update')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('avatar'),
    userValidation.update,
    userController.update)

Router.route('/delete/:id')
  .delete(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('admin'),
    userValidation.deleteUser,
    userController.deleteUser)

Router.route('/')
  .get(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('admin'),
    userController.getAllUsers)

Router.route('/updateRole/:id')
  .put(
    authMiddleware.isAuthorized,
    authMiddleware.checkRole('admin'),
    userValidation.updateRole,
    userController.updateRole)
export const userRoute = Router
