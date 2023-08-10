const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  createdById: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  lastUpdatedById: {
    type: Number,
    required: true,
  },
  lastUpdatedDate: {
    type: Date,
    required: true,
  },
  authStat: {
    type: String,
    required: true,
  },
  recordStat: {
    type: String,
    required: true,
  },
  corporateId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  password : {
    type: String,
    require: true,
  },
  mobilePhoneNumber: {
    type: String,
    required: true,
  },
  officePhoneNumber: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  jobTitle: {
    type: String,
    default: null,
  },
  userTypeId: {
    type: Number,
    required: true,
  },
  enforcePasswordChange: {
    type: Boolean,
    default: false,
  },
  approvalLimit: {
    type: Number,
    default: 0.00,
  },
  transferLimit: {
    type: Number,
    default: 0.00,
  },
  globalAccountAccessEnabled: {
    type: Boolean,
    default: false,
  },
  signatory: {
    type: Boolean,
    default: false,
  },
  autoApprovalEnabled: {
    type: Boolean,
    default: false,
  },
  tokenEnabled: {
    type: Boolean,
    default: false,
  },
  tokenDelivered: {
    type: Boolean,
    default: false,
  },
  viewBalanceEnabled: {
    type: Boolean,
    default: true,
  },
  authenticationModeId: {
    type: Number,
    required: true,
  },
  departmentId: {
    type: Number,
    required: true,
  },
  tokenTypeId: {
    type: String,
    default: null,
  },
  lastLogonDate: {
    type: Date,
    default: null,
  },
  lastPasswordChangeDate: {
    type: Date,
    required: true,
  },
  lastLockedDate: {
    type: Date,
    default: null,
  },
  lockedFlag: {
    type: String,
    default: null,
  },
  lockedBy: {
    type: String,
    default: null,
  },
  corporate: {
    type: String,
    default: null,
  },
  userAccounts: [
    {
      corporateAccountId: {
        type: String,
        default: null,
      },
      rights: {
        type: String,
        default: null,
      },
      transferLimit: {
        type: Number,
        default: null,
      },
      viewBalanceEnabled: {
        type: Boolean,
        default: null,
      },
    },
  ],
  userRoles: [
    {
      roleId: {
        type: String,
        default: null,
      },
    },
  ],
  userChannels: [
    {
      corporateChannelId: {
        type: String,
        default: null,
      },
    },
  ],
});


const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
