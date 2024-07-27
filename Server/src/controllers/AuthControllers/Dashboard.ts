
  
export const Dashboard=(req:any,res:any)=>{
    try {
        const dashboardData = {
          userCount: 1234,
          sales: 56789.0,
          recentTransactions: [
            { id: 1, amount: 100, timestamp: '2024-07-27T12:34:56Z' },
            { id: 2, amount: 200, timestamp: '2024-07-27T13:00:00Z' },
          ],
        };
    
        res.status(200).json(dashboardData);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
      }
    
}