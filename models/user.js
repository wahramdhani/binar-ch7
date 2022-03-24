'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    generateToken = () => {
      const payload = {
        id: this.id,
        username: this.username,
        role: this.role
      }
      const secret = 'rahasia'
      const token = jwt.sign(payload, secret, {expiresIn: '1h'})
      return token
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: instance => {
        const salt = bcrypt.genSaltSync(10);
        (instance.password, salt)
      }
    }
  });
User.authenticate = async function({username, password}) {
  try {
    let instance = await this.findOne({
      where: {
        username: username
      }
    })
    if(!instance) return Promise.reject(new Error("username doesn't exists"))

    let isValidPassword = instance.checkCredential (password);
    if(!isValidPassword)
    return Promise.reject(new Error('wrong password!'));

    return Promise.resolve(instance);
  }
  catch (error) {
    return Promise.reject(err);
  }
}

User.prototype.checkCredential = function (password) {
  return bcrypt.compareSync(password, this.password)
}

  return User;
};