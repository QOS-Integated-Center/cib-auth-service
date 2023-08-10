require('dotenv').config();
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
const EmailUtils = require('../utils/emailUtils');
const NotificationService = require('./Thirdparty/notification.service');
const OtpModel = require('../models/Otp');
const UserModel = require('../models/User');
const axios = require('axios');



// @Service()
class AuthService {
  /**
   *
   */
  static register = async (data) => {
    const user = await UserRepo.find({ email: data.email });
    abortIf(user, httpStatus.BAD_REQUEST, 'Email already Exists');
    abortIf(
      data.password !== data.confirmPassword,
      httpStatus.BAD_REQUEST,
      'Passwords do not match'
    );
    data.password = data.password.trim();
    abortIf(
      !Helpers.isPasswordStrong(data.password),
      httpStatus.BAD_REQUEST,
      'Password is not strong enough'
    );
    const hashed_password = await hash(data.password);
    //create provider
    const find_otp = await OtpRepo.find({
      email: data.email,
      otp: data.otp,
    });
    const generateUniqueID = () => {
      return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    };
    abortIf(!find_otp, httpStatus.BAD_REQUEST, 'This OTP does not exist');
    const _data = {
      requestHeader: {
        requestTypeCode: data.requestTypeCode,
        menuCode: data.menuCode,
        requestReference: data.requestReference,
        contextUrl: data.contextUrl,
        userSessionId: data.userSessionId,
        otp: data.otp
      },
      id: generateUniqueID(),
      code: data.code,
      name: data.name,
      description: data.description,
      createdById: data.createdById,
      createdDate: data.createdDate,
      lastUpdatedById: data.lastUpdatedById,
      lastUpdatedDate: data.lastUpdatedDate,
      authStat: data.authStat,
      recordStat: data.recordStat,
      corporateId: data.corporateId,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      email: data.email,
      password: hashed_password,
      mobilePhoneNumber: data.mobilePhoneNumber,
      officePhoneNumber: data.officePhoneNumber,
      address: data.address,
      jobTitle: data.jobTitle,
      userTypeId: data.userTypeId,
      enforcePasswordChange: data.enforcePasswordChange,
      approvalLimit: data.approvalLimit,
      transferLimit: data.transferLimit,
      globalAccountAccessEnabled: data.globalAccountAccessEnabled,
      signatory: data.signatory,
      autoApprovalEnabled: data.autoApprovalEnabled,
      tokenEnabled: data.tokenEnabled,
      tokenDelivered: data.tokenDelivered,
      viewBalanceEnabled: data.viewBalanceEnabled,
      authenticationModeId: data.authenticationModeId,
      departmentId: data.departmentId,
      tokenTypeId: data.tokenTypeId,
      lastLogonDate: data.lastLogonDate,
      lastPasswordChangeDate: data.lastPasswordChangeDate,
      lastLockedDate: data.lastLockedDate,
      lockedFlag: data.lockedFlag,
      lockedBy: data.lockedBy,
      corporate: data.corporate
    };

    const create = await UserRepo.createUser(_data);
    await EmailUtils.sendTemplateEmail({
      email: data.email.toLowerCase().trim(),
      template: 'WelcomeEmail',
      template_data: '{ "otp":"' + data.email + '"}'
    });
    const userDto = Dtos.userDTO(create);
    const token = await generateToken(userDto);
    return { ...userDto, token };
  };


  static requestOtp = async (data) => {
    //generate otp
    const otp = Helpers.generateRandom(4, 'numeric');
    //store otp on DB
    const create_otp = await OtpRepo.create({
      otp,
      email: data.email.toLowerCase().trim(),
    });
    console.log(create_otp);
    await EmailUtils.sendTemplateEmail({
      email: data.email.toLowerCase().trim(),
      template: 'Otp',
      template_data: '{ "otp":"' + otp + '"}'
    });
    return {};
  };

  static forgotPasswordOtp = async (data) => {
    //generate otp
    const otp = Helpers.generateRandom(4, 'numeric');
    //store otp on DB
    const create_otp = await OtpRepo.create({
      otp,
      email: data.email.toLowerCase().trim(),
    });
    console.log(create_otp);
    //send otp via email
    await EmailUtils.sendTemplateEmail({
      email: data.email.toLowerCase().trim(),
      template: 'Password-Reset',
      template_data: '{ "otp":"' + otp + '"}'
    });
    return {};
  };

  static test = async () => {
    return {};
  };

  static resetPassword = async (data) => {
    const { password, confirmPassword, otp, email } = data;
    console.log(data);
    abortIf(
      password !== confirmPassword,
      httpStatus.BAD_REQUEST,
      'Passwords do not match'
    );
    const find_otp = await OtpModel.find({
      email: data.email.toLowerCase().trim(),
      otp: data.otp,
    });
    console.log(`otp const: ${find_otp}`);
    abortIf(!find_otp, httpStatus.BAD_REQUEST, 'Invalid OTP');
    const user = await UserRepo.find({ email: data.email });
    abortIf(!user, httpStatus.BAD_REQUEST, 'User does not exist');
    const update = await UserRepo.update({ email }, { password: await hash(data.password) });
    return update;
  };

  static verifyAuthOtp = async (data) => {
    const find_otp = OtpRepo.find({ email: data.email, otp: data.otp });
    abortIf(!find_otp, httpStatus.BAD_REQUEST, 'This OTP does not exist');
  };

  // static login = async (req, res) => {
  //   try {
  //     if (!req.body || !req.body.client_id || !req.body.grant_type || !req.body.username || !req.body.password) {
  //       return res.status(httpStatus.BAD_REQUEST).json({
  //         error: 'Missing required fields',
  //       });
  //     }
  
  //     const { client_id, grant_type, username, password } = req.body;
  
  //     const trimmedUsername = username.trim().toLowerCase();
  
  //     const user = await UserRepo.find({ username: trimmedUsername });
  //     console.log(user);
  
  //     if (!user) {
  //       return res.status(httpStatus.BAD_REQUEST).json({
  //         error: 'Invalid Credentials',
  //       });
  //     }
  
  //     const passwordMatch = await bcrypt.compare(password, user.password);
  
  //     if (!passwordMatch) {
  //       return res.status(httpStatus.BAD_REQUEST).json({
  //         error: 'Invalid Credentials',
  //       });
  //     }
  
  //     const userDto = Dtos.userDTO(user);
  //     const token = await generateToken(userDto);
  
  //     // Call Notification Service if needed
  
  //     return res.status(httpStatus.OK).json({ ...userDto, token });
  //   } catch (error) {
  //     return res.status(500 || httpStatus.INTERNAL_SERVER_ERROR).json({
  //       error: error.message || 'An error occurred',
  //     });
  //   }
  // };
  
  // static login = async (req, res) => {
  //   const { client_id, grant_type, password, username } = req.body;
  
  //   // Validate required parameters
  //   if (!client_id || !grant_type || !password || !username) {
  //     return res.status(400).json({ success: false, message: 'Missing required parameters' });
  //   }
  
  //   // Validate client_id and grant_type values
  //   if (client_id !== 'SYSTEM' || grant_type !== 'password') {
  //     return res.status(400).json({ success: false, message: 'Invalid client_id or grant_type' });
  //   }
  
  //   // Authenticate user and check credentials
  //   // Replace this code with your actual authentication logic
  //   if (client_id === 'SYSTEM' && grant_type === 'password' && username === 'system|system_maker@system.com' && password === 'Computer@1_') {
  //     // Authentication successful
  //     // Generate access token or perform any other necessary actions
  //     const accessToken = '...'; // Generate or retrieve access token
  
  //     return res.status(200).json({ success: true, message: 'Login successful', access_token: accessToken });
  //   } else {
  //     // Authentication failed
  //     return res.status(401).json({ success: false, message: 'Invalid username or password' });
  //   }
  // };
  
  static login = async (data) => {
    let { username, password } = data;
    username = username.trim().toLowerCase();
    console.log(data);
    password = password.trim();
    let user = await UserRepo.find({ username });
    abortIf(!user, httpStatus.BAD_REQUEST, 'Invalid Credentials');
    const password_check = await bcrypt.compare(password, user.password);
    abortIf(!password_check, httpStatus.BAD_REQUEST, 'Invalid Credentials');
    const userDto = Dtos.userDTO(user);
    const token = await generateToken(userDto);
    /**
     *  ==> Call Notification Service <==
     */

    return {  token };
  };

  static login1 = async (client_id, grant_type, username, password) => {
    try {
      // Extract the corporate code and username from the input
      const [corporateCode, actualUsername] = username.split('|');

      // Check if the user exists in the database
      const user = await UserModel.findOne({ username: actualUsername });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check if the password is correct
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new Error('Invalid credentials');
      }

      // Construct the request data
      const data = {
        client_id,
        grant_type,
        username: `${corporateCode}|${actualUsername}`,
        password,
      };

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      };

      // const url = 'http://localhost:9000/auth-service/oauth/token';

      const response = await axios.post(url, data, { headers });
      console.log(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };
}

const login = async (req, res) => {
  try {
    if (!req.body || !req.body.client_id || !req.body.grant_type || !req.body.username || !req.body.password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Missing required fields',
      });
    }

    const { client_id, grant_type, username, password } = req.body;

    const trimmedUsername = username.trim().toLowerCase();

    const user = await UserRepo.find({ username: trimmedUsername });

    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Invalid Credentials',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Invalid Credentials',
      });
    }

    const userDto = Dtos.userDTO(user);
    const token = await generateToken(userDto);

    // Call Notification Service if needed

    return res.status(httpStatus.OK).json({ ...userDto, token });
  } catch (error) {
    return res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      error: error.message || 'An error occurred',
    });
  }
};



module.exports = { AuthService, login }