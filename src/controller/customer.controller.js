// const catchAsync = require('../utils/catchAsync');
const { catchAsync } = require('../utils/catchAsync');
const { CustomerService } = require('../services/customer.service');
const {
  successResponse,
  abortIf,
  errorResponse,
  download,
  downloadFile,
} = require('../utils/responder');
const User = require('../models/User');

// import httpStatus from 'http-status';
// import { Service } from 'typedi';
// import { paginateOptions } from '../utils/paginate';
// import console from 'console';

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Access the user ID from the route parameter
    const data = req.body; // Get the updated user profile data from the request body
    delete data.userName;
    delete data.profileUrl;

    let user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update the user properties
    for (let prop in data) {
      if (data.hasOwnProperty(prop)) {
        user[prop] = data[prop];
      }
    }

    const updatedUser = await user.save();

    return res.json(updatedUser);
  } catch (error) {
    throw error;
  }
};

// @Service()
class CustomerController {
  /**
   *
   */
  // constructor(private readonly authService: AuthService) {}
  static addInterestController = catchAsync(
    async (req, res, next) => {
      const _create = await CustomerService.addInterest(req.body, req.auth);
      return successResponse(req, res, _create);
    }
  );

  static updateInterestController = catchAsync(
    async (req, res, next) => {
      const _create = await CustomerService.updateInterest(req.body, req.auth);
      return successResponse(req, res, _create);
    }
  );

  static deleteInterestController = catchAsync(
    async (req, res, next) => {
      const _create = await CustomerService.deleteInterest(req.query.interests, req.auth);
      return successResponse(req, res, _create);
    }
  );

  static updateUserProfileController = catchAsync(
    async (req, res, next) => {
      const _create = await CustomerService.updateUserProfile(req.body, req.auth);
      return successResponse(req, res, _create);
    }
  );
}

module.exports = { CustomerController, updateUserProfile }