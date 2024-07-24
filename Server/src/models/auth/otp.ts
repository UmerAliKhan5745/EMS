import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/dbs'; // Import your Sequelize instance
import User from './user'; // Adjust the import path as necessary



const   OTP = sequelize.define('OTP', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Reference to the User model
            key: 'id',   // Key in the User model
        }
        },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'OTP',
    tableName:"OTPs"
  }
);

export default OTP;
