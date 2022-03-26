'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init({
    room_name: DataTypes.STRING,
    player1: DataTypes.INTEGER,
    player2: DataTypes.INTEGER,
    p1Pick: DataTypes.ARRAY(DataTypes.STRING),
    p2Pick: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms',
    paranoid: true
  });
  return Room;
};