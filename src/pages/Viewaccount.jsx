import React, { useState, useEffect } from 'react';
import { Camera, ChevronLeft, Edit } from 'lucide-react'; // Import icons
import { useNavigate } from 'react-router-dom';

const Viewaccount = () => {
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState(''); // State to store the username
  const [imageOffset, setImageOffset] = useState(0); // State to track the vertical offset of the cover photo
  const [isDragging, setIsDragging] = useState(false); // State to track if the image is being dragged
  const [isEditingBio, setIsEditingBio] = useState(false); // State to track if the bio is being edited
  const [tempBio, setTempBio] = useState(''); // State to store the temporary bio for editing
  const navigate = useNavigate();

  const handleBioSave = () => {
    setBio(tempBio); // Update the bio
    setIsEditingBio(false); // Close the modal
    if (username) {
      localStorage.setItem(`${username}_bio`, tempBio); // Save bio to localStorage
    }
  };

  // Load saved data for the logged-in user
  useEffect(() => {
    const savedUsername = sessionStorage.getItem('username'); // Retrieve username from sessionStorage
    if (savedUsername) {
      setUsername(savedUsername);

      // Load user-specific data from localStorage
      const userCoverPhoto = localStorage.getItem(`${savedUsername}_coverPhoto`);
      const userProfilePhoto = localStorage.getItem(`${savedUsername}_profilePhoto`);
      const userBio = localStorage.getItem(`${savedUsername}_bio`);
      const userImageOffset = localStorage.getItem(`${savedUsername}_imageOffset`);

      if (userCoverPhoto) setCoverPhoto(userCoverPhoto);
      if (userProfilePhoto) setProfilePhoto(userProfilePhoto);
      if (userBio) setBio(userBio);
      if (userImageOffset) setImageOffset(parseInt(userImageOffset, 10));
    }
  }, []);

  // Save user-specific data to localStorage
  const handleFileChange = (e, setImage, storageKey) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImage(base64Image); // Update state
        if (username) {
          localStorage.setItem(`${username}_${storageKey}`, base64Image); // Save to localStorage with username as key
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = (e) => {
    const updatedBio = e.target.value;
    setBio(updatedBio);
    if (username) {
      localStorage.setItem(`${username}_bio`, updatedBio); // Save bio to localStorage with username as key
    }
  };

  // Handle drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (isDragging) {
      const containerHeight = 288; // Height of the container (in pixels)
      const imageHeight = document.querySelector('.cover-photo img')?.offsetHeight || containerHeight;
  
      const maxOffset = 0; // The top of the image
      const minOffset = containerHeight - imageHeight; // The bottom of the image (negative value)
  
      const newOffset = imageOffset + e.movementY; // Update the offset based on mouse movement
  
      // Constrain the offset to prevent moving beyond the image boundaries
      if (newOffset <= maxOffset && newOffset >= minOffset) {
        setImageOffset(newOffset);
      }
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    if (username) {
      localStorage.setItem(`${username}_imageOffset`, imageOffset); // Save the offset to localStorage
    }
  };

  return (
    <div className="view-account">
      {/* Cover Photo Section */}
      <div
        className="cover-photo relative overflow-hidden"
        style={{ height: '288px', cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Top-Left Button */}
        <button
          onClick={() => navigate('/marketplace')} // Navigate to marketplace
          className="absolute top-4 left-4 z-30 p-3 bg-gray-800/50 rounded-full backdrop-blur hover:bg-purple-600 transition"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <img
          src={coverPhoto || 'default-cover-photo-url.jpg'}
          alt="Cover"
          className="absolute w-full object-cover"
          style={{ top: `${imageOffset}px` }} // Apply the vertical offset
        />
        <label
          className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 rounded cursor-pointer flex items-center gap-2 hover:bg-blue-600"
        >
          <Camera size={16} /> Change Cover Photo
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e, setCoverPhoto, 'coverPhoto')}
          />
        </label>
      </div>

      {/* Profile Photo Section */}
      <div className="text-center mt-[-50px]">
        <div className="relative inline-block rounded-full overflow-hidden w-36 h-36 border-4 border-white">
          <img
            src={profilePhoto || 'default-profile-photo-url.jpg'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <label
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
          >
            <Camera size={16} />
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e, setProfilePhoto, 'profilePhoto')}
            />
          </label>
        </div>
      </div>

      {/* Username and Bio Section */}
      <div className="text-center mt-5">
        <div className="view-account">
      {/* Username and Bio Section */}
      <div className="text-center mt-5">
        <h3>{username || 'Guest Account'}</h3> {/* Dynamically display username */}
        <div className="mt-5">
          <h4>Bio</h4>
          <div className="relative w-4/5 mx-auto">
            <p>{bio || 'No bio available'}</p>
            <button
              onClick={() => {
                setTempBio(bio); // Set the temporary bio for editing
                setIsEditingBio(true); // Open the modal
              }}
              className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
            >
              <Edit size={16} />
            </button>
          </div>
        </div>
      </div>

        {/* Modal for Editing Bio */}
        {isEditingBio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-md">
              <h4 className="text-lg font-semibold mb-4">Edit Bio</h4>
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                className="w-full h-24 p-2 rounded-lg border border-gray-300"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleBioSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Viewaccount;