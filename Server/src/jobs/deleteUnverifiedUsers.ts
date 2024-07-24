import cron from 'node-cron';
import User from '../models/auth/user';
import { Op } from 'sequelize';

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5*60 * 1000); // 10 seconds ago
    console.log(`Cron job running. Deleting users not verified before ${fiveMinutesAgo}`);

    try {
        const usersToDelete = await User.findAll({
            where: {
                isVerified: false,
                createdAt: {
                    [Op.lt]: fiveMinutesAgo
                }
            }
        });

        console.log(`Users to delete: ${usersToDelete.length}`);

        if (usersToDelete.length > 0) {
            const deletedUsers = await User.destroy({
                where: {
                    isVerified: false,
                    createdAt: {
                        [Op.lt]: fiveMinutesAgo
                    }
                }
            });

            console.log(`Deleted ${deletedUsers} unverified users.`);
        } else {
            console.log('No users to delete.');
        }
    } catch (error) {
        console.error('Error deleting unverified users:', error);
    }
});
