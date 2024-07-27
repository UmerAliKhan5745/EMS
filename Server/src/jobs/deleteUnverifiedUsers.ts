import cron from 'node-cron';
import User from '../models/auth/user';
import OTP from '../models/auth/otp';
import { Op } from 'sequelize';

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000); // 10 seconds ago
    console.log(`Cron job running. Deleting unverified users and associated OTPs before ${tenSecondsAgo}`);

    try {
        // Find unverified users created before ten seconds ago
        const usersToDelete = await User.findAll({
            where: {
                isVerified: false,
                createdAt: {
                    [Op.lt]: tenSecondsAgo
                }
            }
        });

        console.log(`Users to delete: ${usersToDelete.length}`);

        if (usersToDelete.length > 0) {
            // Extract user IDs of the unverified users
            const userIds = usersToDelete.map((user:any) => user.id);

            // Delete associated OTPs
            const deletedOTPs = await OTP.destroy({
                where: {
                    userId: {
                        [Op.in]: userIds
                    }
                }
            });

            // Delete the unverified users
            const deletedUsers = await User.destroy({
                where: {
                    id: {
                        [Op.in]: userIds
                    }
                }
            });

            console.log(`Deleted ${deletedUsers} unverified users and ${deletedOTPs} associated OTPs.`);
        } else {
            console.log('No users to delete.');
        }
    } catch (error) {
        console.error('Error deleting unverified users or associated OTPs:', error);
    }
});
