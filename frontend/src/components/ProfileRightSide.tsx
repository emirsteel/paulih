import React from "react";
import { FaPlus, FaCalendarDay, FaClock, FaMapMarkerAlt } from "react-icons/fa";

interface ProfileRightSideProps {
  interestedUsers: any[];
  getProfileImageUrl: (imagePath: string) => string;
  currentUser: any; // Logged-in user object containing a friends array
}

const ProfileRightSide: React.FC<ProfileRightSideProps> = ({
  interestedUsers,
  getProfileImageUrl,
  currentUser,
}) => {
  // Filter out users that are already friends with currentUser.
  const filteredInterestedUsers = interestedUsers.filter((person) => {
    const personId = person._id.toString();
    const friendIds = currentUser.friends?.map((f: any) => f.toString()) || [];
    return !friendIds.includes(personId);
  });

  return (
    <div className="w-full md:w-1/4 space-y-6">
      {/* Interested In Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-6">Interested In</h2>
        {filteredInterestedUsers.length > 0 ? (
          <ul className="space-y-4">
            {filteredInterestedUsers.slice(0, 7).map((person, index) => (
              <li
                key={person._id || index}
                className="flex items-center justify-between hover:bg-gray-100 cursor-pointer rounded-lg p-2"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={getProfileImageUrl(person.profileImage)}
                    alt={person.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="text-gray-800 font-medium">
                    {person.name}
                  </span>
                </div>
                <button className="text-blue-500 p-2 rounded-full hover:bg-blue-100">
                  <FaPlus />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No recommendations available.</p>
        )}
      </div>

      {/* Fake Google Ad Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <p className="text-gray-500 text-xs">Ad · www.example.com</p>
        <h3 className="text-lg font-semibold text-blue-700 mb-2">
          Explore Our Amazing Tours!
        </h3>
        <p className="text-gray-700 text-sm">
          Discover unforgettable destinations and book unique travel experiences
          with us.
        </p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200">
          Learn More
        </button>
      </div>

      {/* Weekly Schedule Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">This Week's Classes</h2>
        <div className="space-y-6">
          {/* Monday */}
          <div className="border-b pb-4">
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <FaCalendarDay />
              <p className="font-semibold">Monday</p>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <FaClock className="text-gray-500" />
              <p className="text-gray-700 text-sm">Math 101 - 10:00 AM</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <p className="text-gray-500 text-xs">Room A1</p>
            </div>
          </div>
          {/* Tuesday */}
          <div className="border-b pb-4">
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <FaCalendarDay />
              <p className="font-semibold">Tuesday</p>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <FaClock className="text-gray-500" />
              <p className="text-gray-700 text-sm">Biology 101 - 9:00 AM</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <p className="text-gray-500 text-xs">Lab 3</p>
            </div>
          </div>
          {/* Wednesday */}
          <div className="border-b pb-4">
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <FaCalendarDay />
              <p className="font-semibold">Wednesday</p>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <FaClock className="text-gray-500" />
              <p className="text-gray-700 text-sm">Chemistry 101 - 11:00 AM</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <p className="text-gray-500 text-xs">Lab 2</p>
            </div>
          </div>
          {/* Thursday */}
          <div className="border-b pb-4">
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <FaCalendarDay />
              <p className="font-semibold">Thursday</p>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <FaClock className="text-gray-500" />
              <p className="text-gray-700 text-sm">Physics 101 - 10:00 AM</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <p className="text-gray-500 text-xs">Room A2</p>
            </div>
          </div>
          {/* Friday */}
          <div>
            <div className="flex items-center space-x-2 text-blue-600 mb-2">
              <FaCalendarDay />
              <p className="font-semibold">Friday</p>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <FaClock className="text-gray-500" />
              <p className="text-gray-700 text-sm">Economics 101 - 9:00 AM</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <p className="text-gray-500 text-xs">Room F1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRightSide;
