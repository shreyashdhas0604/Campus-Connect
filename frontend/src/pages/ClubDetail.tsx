import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  year: string;
  division: string;
  department: string;
  profilePic: string;
}

interface Member {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: UserData;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
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
  memberships: any[];
}

const ROLES = [
  'PRESIDENT',
  'VICE_PRESIDENT',
  'SECRETARY',
  'TREASURER',
  'MEMBER'
];

const ClubDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [myuser, setMyuser] = useState<any>({});
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = user.id;
      const response = await apiClient.get<ApiResponse<Club>>(`/club/clubs/${id}`);
      let clubData = response.data.data;

      // Fetch user details for each member
      const membersWithDetails = await Promise.all(
        clubData.memberships.map(async (member: any) => {
          const userResponse = await apiClient.get<ApiResponse<UserData>>(`/user/user/${member.userId}`);
          const userData = userResponse.data.data;
          return {
            ...member,
            user: userData
          };
        })
      );

      setClub({
        ...clubData,
        members: Array.isArray(membersWithDetails) ? membersWithDetails : [],
        activities: Array.isArray(clubData.activities) ? clubData.activities : []
      });

      // Check user's role in the club
      const userClubsResponse = await apiClient.get<ApiResponse<any[]>>(`club/users/${userId}/clubs`);
      const userClubs = userClubsResponse.data.data || [];
      const userClub = userClubs.find((c: any) => c.clubId === parseInt(id || '0'));
      setUserRole(userClub?.role || null);
    } catch (err) {
      setError('Failed to fetch club details.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async () => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId1 = user.id;
    try {
      const response = await apiClient.post('club/memberships/join', {
        userId: userId1,
        clubId: id,
        role: 'MEMBER'
      });
      console.log(response.data);
      fetchClubDetails();
    } catch (err) {
      setError('Failed to join the club.');
    }
  };

  const handleLeaveClub = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId1 = user.id;
      await apiClient.delete(`/club/member/clubs/${id}/members/${userId1}`);
      fetchClubDetails();
    } catch (err) {
      setError('Failed to leave the club.');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await apiClient.delete(`/club/member/clubs/${id}/members/${memberId}`);
      fetchClubDetails();
    } catch (err) {
      setError('Failed to remove member.');
    }
  };

  const handleEditMemberRole = async (memberId: string, newRole: string) => {
    try {
      console.log('Updating member role:', memberId, newRole,id);
      const res = await apiClient.patch('/club/memberships/rolebyId', {
        memberId: memberId,
        clubId: id,
        role: newRole
      });
      console.log(res.data);
      setEditingMember(null);
      setSelectedRole('');
      fetchClubDetails();
    } catch (err) {
      setError('Failed to update member role.');
    }
  };

  const startEditingMember = (memberId: string, currentRole: string) => {
    setEditingMember(memberId);
    setSelectedRole(currentRole);
  };

  const cancelEditing = () => {
    setEditingMember(null);
    setSelectedRole('');
  };

  const handleEditClub = async () => {
    // Implement the logic to edit the club
    console.log('Edit club functionality');
  };

  const handleDeleteClub = async () => {
    try {
      await apiClient.delete(`/club/clubs/${id}`);
      // Redirect or update the UI after deletion
      console.log('Club deleted successfully');
    } catch (err) {
      setError('Failed to delete the club.');
    }
  };

  const handleMemberClick = async (member: Member) => {
    try {
      const response = await apiClient.get<ApiResponse<UserData>>(`/user/user/${member.userId}`);
      const userData = response.data.data;
      setSelectedMember({
        ...member,
        user: {
          ...member.user,
          ...userData
        }
      });
      setShowMemberModal(true);
    } catch (err) {
      setError('Failed to fetch member details.');
    }
  };

  const closeMemberModal = () => {
    setShowMemberModal(false);
    setSelectedMember(null);
  };

  if (loading) return <div>Loading club details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!club) return <div>Club not found</div>;

  const isAdmin = userRole === 'ADMIN';
  const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

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
            // Only show Leave Club button if user is not an admin
            !isAdmin && (
              <button
                onClick={handleLeaveClub}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Leave Club
              </button>
            )
          )}
          {isAdmin && (
            <>
              <button
                onClick={handleEditClub}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit Club
              </button>
              <button
                onClick={handleDeleteClub}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Club
              </button>
            </>
          )}
        </div>

        {/* Members Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {club.members.map((member) => (
              <div 
                key={member.id} 
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleMemberClick(member)}
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={member.user.profilePic || 'https://via.placeholder.com/50'} 
                    alt={member.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{member.user.name}</h3>
                    <p className="text-gray-600 text-sm">{member.role.replace('_', ' ')}</p>
                  </div>
                </div>
                
                {/* Role display/edit */}
                {editingMember === member.id ? (
                  <div className="mt-2">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="border rounded px-2 py-1 text-sm mb-2 w-full"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMemberRole(member.id, selectedRole);
                        }}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEditing();
                        }}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">{member.role.replace('_', ' ')}</p>
                )}
                
                <p className="text-gray-500 text-sm">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                
                {/* Admin controls */}
                {isAdmin && editingMember !== member.id && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingMember(member.id, member.role);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit Role
                    </button>
                    {/* Don't show remove button for the current admin user */}
                    {member.userId !== currentUser.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMember(member.userId);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Member Details Modal */}
        {showMemberModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Member Details</h2>
                <button 
                  onClick={closeMemberModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-6">
                <img 
                  src={selectedMember.user.profilePic || 'https://via.placeholder.com/150'} 
                  alt={selectedMember.user.name}
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-semibold text-gray-800">{selectedMember.user.name}</h3>
                <p className="text-gray-600">{selectedMember.role.replace('_', ' ')}</p>
              </div>

              <div className="space-y-3 bg-white/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-600">{selectedMember.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="text-gray-600">{selectedMember.user.contactNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Department:</span>
                  <span className="text-gray-600">{selectedMember.user.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Year:</span>
                  <span className="text-gray-600">{selectedMember.user.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Division:</span>
                  <span className="text-gray-600">{selectedMember.user.division}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Joined:</span>
                  <span className="text-gray-600">{new Date(selectedMember.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activities Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Activities</h2>
          <button
          onClick={() => navigate(`/clubs/${club.id}/activities`)}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Activities Page
        </button>
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