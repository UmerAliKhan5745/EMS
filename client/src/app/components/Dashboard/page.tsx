"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { isAuthenticated } from '@/app/utils/checkingAuthToken/authenication';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState('loading');

  useEffect(() => {
    const authenticate = async () => {
      const isAuthenticatedUser = await isAuthenticated();
      setAuthenticated(isAuthenticatedUser ? 'authorized' : 'unauthorized');
    };

    authenticate();

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/deleteitsoon');
        console.log(response)
        if (response.status === 200) {
          setData(response.data);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || authenticated === 'loading') return <div>Loading...</div>;
  if (authenticated === 'unauthorized') return <div>Unauthorized access</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Summary</h2>
        <p>User Count: {data?.userCount}</p>
        <p>Total Sales: ${data?.sales.toFixed(2)}</p>
      </div>
      <div>
        <h2>Recent Transactions</h2>
        <ul>
          {data?.recentTransactions.map((transaction: any) => (
            <li key={transaction.id}>
              Amount: ${transaction.amount} - Date: {new Date(transaction.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
