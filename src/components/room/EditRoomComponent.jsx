import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RoomTypeSelector from '../common/RoomTypeSelector';
import { getRoomById, updateRoom } from '../utils/ApiFunctions';
import '../styles/index.css'
const EditRoom = () => {
  const { roomId } = useParams();

  // State hooks
  const [room, setRoom] = useState({
    photo: null,
    roomType: '',
    roomPrice: '',
    description: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomData = await getRoomById(roomId);
        if (roomData) {
          setRoom(roomData);
          setImagePreview(`data:image/jpeg;base64,${roomData.photo}`);
        } else {
          // Nếu không có dữ liệu phòng, đặt giá trị mặc định cho roomType và roomPrice
          setRoom({
            photo: null,
            roomType: '',
            roomPrice: '',
            description: ''
          });
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };
    fetchRoomData();
  }, [roomId]);
  
  // Event handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setRoom({ ...room, photo: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Lấy token từ local storage
      const response = await updateRoom(roomId, room, token); // Truyền token vào hàm updateRoom
      if (response) {
        setSuccessMessage('Room updated successfully');
        setRoom(response.data);
      } else {
        setErrorMessage('Error updating room. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  

  // Render
  return (
    <section className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="mt-5 mb-2">Edit Room</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="roomType" className="form-label">
                Room Type
              </label>
              <div>
                <RoomTypeSelector
                  handleRoomInputChange={handleInputChange}
                  newRoom={room}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="roomPrice" className="form-label">
                Room Price
              </label>
              <input
                className="form-control"
                required
                id="roomPrice"
                type="number"
                name="roomPrice"
                value={room ? room.roomPrice : ''}
                onChange={handleInputChange}
              />

            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Room Description
              </label>
              <textarea
                className="form-control"
                required
                id="description"
                name="description"
                value={room ? room.description : ''}
                onChange={handleInputChange}  
              />
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                Room Photo
              </label>
              <input
                className="form-control"
                required
                type="file"
                id="photo"
                name="photo"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Room preview"
                    style={{ maxWidth: '400px', maxHeight: '400px' }}
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
            <div className="d-grid d-md-flex mt-2">
              <Link to="/existing-roomss" className="btn btn-outline-secondary">
                Back to Rooms
              </Link>
              <button className="btn btn-outline-primary ml-5" type="submit">
                Save Changes
              </button>
            </div>
          </form>
          {successMessage && (
            <div className="alert alert-success fade show mt-3">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="alert alert-danger fade show mt-3">{errorMessage}</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditRoom;
