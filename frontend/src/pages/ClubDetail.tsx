import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

interface Member {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Club {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  members: Member[];
  activities: Activity[];
}

const ClubDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/clubs/${id}`);
      setClub((response.data as any).data as Club);
      
      // Check user's role in the club
      const userClubsResponse = await apiClient.get('/api/users/me/clubs');
      const userClub = (userClubsResponse.data as { data: Array<{ clubId: string; role: string }> }).data.find(c => c.clubId === id);
      setUserRole(userClub?.role || null);
    } catch (err) {
      setError('Failed to fetch club details.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async () => {
    try {
      await apiClient.post(`/api/clubs/${id}/members`, {
        userId: localStorage.getItem('userId')
      });
      fetchClubDetails();
    } catch (err) {
      setError('Failed to join the club.');
    }
  };

  const handleLeaveClub = async () => {
    try {
      await apiClient.delete(`/api/clubs/${id}/members/${localStorage.getItem('userId')}`);
      fetchClubDetails();
    } catch (err) {
      setError('Failed to leave the club.');
    }
  };

  if (loading) return <div>Loading club details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!club) return <div>Club not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{club.name}</h1>
        <p className="text-gray-600 mb-4">{club.description}</p>
        <div className="flex items-center gap-4 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm ${club.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {club.status}
          </span>
          {!userRole ? (
            <button
              onClick={handleJoinClub}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Join Club
            </button>
          ) : (
            <button
              onClick={handleLeaveClub}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Leave Club
            </button>
          )}
        </div>

        {/* Members Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {club.members.map((member) => (
              <div key={member.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{member.user.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
                <p className="text-gray-500 text-sm">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Activities</h2>
          <div className="space-y-4">
            {club.activities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{activity.title}</h3>
                <p className="text-gray-600 mb-2">{activity.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Start: {new Date(activity.startDate).toLocaleDateString()}</span>
                  <span>End: {new Date(activity.endDate).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded ${activity.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;