  // const catchAsync = require('../utils/catchAsync');
const { catchAsync } = require('../utils/catchAsync');
const {AuthService, login} = require('../services/auth.service');
const {
  successResponse,
  abortIf,
  errorResponse,
  download,
  downloadFile,
} = require('../utils/responder');
// import httpStatus from 'http-status';
// import { Service } from 'typedi';
// import { paginateOptions } from '../utils/paginate';
// import console from 'console';

// @Service()
class AuthController {
  /**
   *
   */

   static loginController = catchAsync(
    async (req, res, next) => {
      const _create = await AuthService.login(req.body);
      return successResponse(req, res, _create);
    }
  );
  // constructor(private readonly authService: AuthService) {}
  // static loginController = async (req, res, next) => {
  //   try {
  //     const { client_id, username, password } = req.body;
  
  //     const result = await AuthService.login({
  //       client_id,
  //       grant_type: '', // Add the grant_type value here
  //       username,
  //       password
  //     });
  
  //     return successResponse(req, res, result);
  //   } catch (error) {
  //     // Handle the error
  //     next(error);
  //   }
  // };
  

  static registerController = catchAsync(
    async (req, res, next) => {
      const _update = await AuthService.register(req.body);
      return successResponse(req, res, _update);
    }
  );

  static requestOtpController = catchAsync(
    async (req, res, next) => {
      const _update = await AuthService.requestOtp(req.body);
      return successResponse(req, res, _update);
    }
  );

  static resetPasswordOtpController = catchAsync(
    async (req, res, next) => {
      const _update = await AuthService.forgotPasswordOtp(req.body);
      return successResponse(req, res, _update);
    }
  );

  static resetPasswordController = catchAsync(
    async (req, res, next) => {
      const _update = await AuthService.resetPassword(req.body);
      return successResponse(req, res, _update);
    }
  );

  static test = catchAsync(async (req, res, next) => {
    const _update = await AuthService.test();
    return successResponse(req, res, _update);
  });
}

module.exports = {AuthController}