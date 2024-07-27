import nookies from 'nookies';

export const isAuthenticated = async () => {
  const cookies = nookies.get(null);
  const token = cookies.token;

  try {
    if (!token) {
      console.log('User is not authenticated');
      return false;
    }

    const response = await fetch("http://localhost:5000/api/auth/protected", {
      method: "GET", // Corrected method to GET as this is typically used for such checks
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Ensure Bearer token format
      },
    });


    if (response.ok) {
      return true;
    } else {
      console.log("Authentication failed. Status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    return false;
  }
};
