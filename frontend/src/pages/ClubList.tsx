import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

interface Club {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
} 

const ClubList = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/club/search', {
        params: { query: searchTerm }
      });
      setClubs(response?.data as Club[]); // Type assertion to ensure data matches Club[] type
      setError('');
    } catch (err) {
      setError('Failed to fetch clubs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClubs();
  };

  if (loading) return <div>Loading clubs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Campus Clubs</h1>
        <button
          onClick={() => window.location.href = '/clubs/create'}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Club
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clubs..."
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clubs.map((club) => (
          <div key={club.id} className="bg-white border rounded-lg p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-xl font-semibold mb-2">{club.name}</h2>
            <p className="text-gray-600 mb-4">{club.description}</p>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-sm ${club.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {club.status}
              </span>
              <button 
                onClick={() => window.location.href = `/clubs/${club.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubList;