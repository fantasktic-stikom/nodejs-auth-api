'use strict';
var bcrypt = require("bcrypt");
const models = require('../models/index')
require('dotenv').config()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const name = 'Ryan Adhitama Putra'
    const email = 'test@gmail.com'
    const password = 'test'
    const encryptedPassword = await bcrypt.hash(password, 10)
    const user = await models.users.create({
         name,
         email
    })
    user.password = encryptedPassword
    user.save()
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
