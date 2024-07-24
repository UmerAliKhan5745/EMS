import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sequelize } from './config/dbs';
import User from './models/auth/user';
import OTP from './models/auth/otp';
import './jobs/deleteUnverifiedUsers'; // Import the cron job file if needed

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Define associations
User.hasMany(OTP, { foreignKey: 'userId', onDelete: 'CASCADE' });
OTP.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

// Sync database and start server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');

        // Synchronize all models
        await sequelize.sync();
        console.log('Database synchronized');

        // Now define routes
        app.use('/api', require('./routes/AuthRoutes'));

        const PORT = process.env['PORT'] || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
