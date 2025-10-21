import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // const verifyToken = async () => {
    //   try {
    //     const response = await axios.get('/api/auth/me', {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });

    //     // If token valid → stay on homepage
    //     if (response.status === 200 && response.data.user) {
    //       navigate('/');
    //     } else {
    //       localStorage.removeItem('token');
    //       navigate('/login');
    //     }
    //   } catch {
    //     localStorage.removeItem('token');
    //     navigate('/login');
    //   }
    // };

    // verifyToken();
  }, [navigate]);
}
