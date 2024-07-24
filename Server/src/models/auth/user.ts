// models/auth/user.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/dbs'; // Adjust the path to your database connection

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true // Change to true if either email or phoneNumber is allowed
    },
    phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true // Change to true if either email or phoneNumber is allowed
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
});

export default User;
