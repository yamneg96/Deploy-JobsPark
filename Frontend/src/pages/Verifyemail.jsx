import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timer } from 'lucide-react';
import { verifyEmail } from '../services/auth';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying...');
  const [type, setType] = useState('info');

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setMessage('✅ Email verified successfully! You can now log in.');
        setType('success');

        setTimeout(() => {
          navigate('/login', { state: { verified: true } });
        }, 2000);
      } catch (err) {
        setMessage('❌ Verification link is invalid or expired.');
        setType('error');

        setTimeout(() => {
          navigate('/register');
        }, 3000);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className={`p-6 rounded shadow text-center max-w-md ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        <Timer className='inline mx-2' />
        <h2 className="text-xl font-semibold">{message}</h2>
      </div>
    </div>
  );
};

export default VerifyEmail;