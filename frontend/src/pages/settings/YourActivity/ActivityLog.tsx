import React from "react";

const ActivityLog: React.FC = () => {
  const activities = [
    { id: 1, activity: "Liked a post", timestamp: "2024-12-24 14:32" },
    { id: 2, activity: "Joined a group", timestamp: "2024-12-23 10:15" },
    {
      id: 3,
      activity: "Updated profile picture",
      timestamp: "2024-12-22 18:45",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-600 mb-4">Activity Log</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p>Your recent activities on the platform:</p>
        <ul className="mt-4 space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start">
              <span className="flex-shrink-0 bg-blue-100 text-blue-600 w-10 h-10 flex items-center justify-center rounded-full font-bold mr-4">
                {activity.activity.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-medium">{activity.activity}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivityLog;
