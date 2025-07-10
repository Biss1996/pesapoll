import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

const AdminLogin = () => {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login(password)) alert('Wrong password!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Login as Admin
      </button>
    </form>
  );
};

export default AdminLogin;
