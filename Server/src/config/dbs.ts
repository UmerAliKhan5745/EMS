// Option 3: Passing parameters separately (other dialects)
const { Sequelize } = require('sequelize');

export const sequelize = new Sequelize('EMS', 'root', 'Cricketare@1234', {
    host: 'localhost',
    dialect: 'mysql',
    logging:false
  });


  