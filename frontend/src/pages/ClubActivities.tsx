import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ClubActivities = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: ''
  });

  useEffect(() => {
    fetchActivities();
  }, [clubId]);

  const fetchActivities = async () => {
    try {
      const response = await apiClient.get(`/api/clubs/${clubId}/activities`);
      setActivities((response.data as { data: Activity[] }).data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/api/clubs/${clubId}/activities`, newActivity);
      fetchActivities();
      setNewActivity({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: ''
      });
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  const handleUpdateActivity = async (activityId: string, status: string) => {
    try {
      await apiClient.put(`/api/clubs/${clubId}/activities/${activityId}`, { status });
      fetchActivities();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading activities...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Club Activities</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Create Activity Form */}
      <form onSubmit={handleCreateActivity} className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Activity</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location (Optional)</label>
            <input
              type="text"
              value={newActivity.location || ''}
              onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="datetime-local"
                value={newActivity.startDate}
                onChange={(e) => setNewActivity({ ...newActivity, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="datetime-local"
                value={newActivity.endDate}
                onChange={(e) => setNewActivity({ ...newActivity, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Activity
        </button>
      </form>

      {/* Activities List */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No activities found. Create your first activity above.
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{activity.title}</h3>
                  <p className="text-gray-600">{activity.description}</p>
                  {activity.location && (
                    <p className="text-gray-500 text-sm mt-2">
                      <span className="font-medium">Location:</span> {activity.location}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    activity.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : activity.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {activity.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Starts: {new Date(activity.startDate).toLocaleString()}</span>
                <span>Ends: {new Date(activity.endDate).toLocaleString()}</span>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                {activity.status !== 'ACTIVE' && (
                  <button
                    onClick={() => handleUpdateActivity(activity.id, 'ACTIVE')}
                    className="text-green-600 hover:text-green-800 px-3 py-1 rounded border border-green-600 hover:bg-green-50"
                  >
                    Activate
                  </button>
                )}
                {activity.status !== 'INACTIVE' && (
                  <button
                    onClick={() => handleUpdateActivity(activity.id, 'INACTIVE')}
                    className="text-yellow-600 hover:text-yellow-800 px-3 py-1 rounded border border-yellow-600 hover:bg-yellow-50"
                  >
                    Deactivate
                  </button>
                )}
                {activity.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateActivity(activity.id, 'CANCELLED')}
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubActivities;