const httpStatus = require('http-status');
// const { v4 } = require('uuid');
const bcrypt = require('bcryptjs');
const Helpers = require('../utils/helper.service');
const { generateToken } = require('../utils/tokenManagement');
const { abortIf } = require('../utils/responder');
const { generate_random_password, hash } = require('../utils/passwordHash');
// import path from 'path';
const { paginate, paginateOptions } = require('../utils/paginate');
const UserRepo = require('../dbservices/user.table');
const moment = require('moment');
const OtpRepo = require('../dbservices/otp.table');
const { Dtos } = require('../Dto/user.dto');
const { EmailUtils } = require('../utils/emailUtils');
const NotificationService = require('./Thirdparty/notification.service');
const User = require('../models/User');

// @Service()
class CustomerService {
  /**
   *
   */
  static addInterest = async (data, auth) => {
    let user = await UserRepo.find({ _id: auth.user_id });
    let new_arr = [...user.interests, ...data.interests];
    user.interests = new_arr;
    user.save()
    return user
  };

  static updateInterest = async (data, auth) => {
    let user = await UserRepo.find({ _id: auth.user_id });
    let new_arr = data.interests
    user.interests = new_arr;
    user.save()
    return user
  };

  static deleteInterest = async (interests, auth) => {
    let user = await UserRepo.find({ _id: auth.user_id });
    let new_arr = user.interests;
    const check = new_arr.includes(interests)
    abortIf(!check, httpStatus.BAD_REQUEST, 'This is not a selected interest by the user')
    const index = new_arr.indexOf(interests);
    const x = new_arr.splice(index, 1);
    user.interests = new_arr
    user.save()
    return user
  };

  // static updateUserProfile = async (req, res) => {
  //   try {
  //     const userId = req.params.id; // Access the user ID from the route parameter
  //     const data = req.body; // Get the updated user profile data from the request body
  
  //     let user = await User.findById(userId);
  //     if (!user) {
  //       throw new Error("User not found");
  //     }
  
  //     // Update the user properties
  //     user.userName = data.userName;
  //     user.fullName = data.fullName;
  //     user.email = data.email;
  //     user.DOB = data.DOB;
  //     user.interests = data.interests;
  //     user.active = data.active;
  //     user.suspended = data.suspended;
  //     user.deleted = data.deleted;
  //     user.country = data.country;
  //     user.state = data.state;
  //     user.geoLocation = data.geoLocation;
  //     user.currency = data.currency;
  //     user.street = data.street;
  //     user.profileUrl = data.profileUrl;
  
  //     const updatedUser = await user.save();
  
  //     return res.json(updatedUser);
  //   } catch (error) {
  //     throw error;
  //   }
  // };


}

module.exports = { CustomerService }