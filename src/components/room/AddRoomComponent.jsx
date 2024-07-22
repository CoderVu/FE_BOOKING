import React, { useState, useEffect } from 'react';
import { AddRoom, getHotelsByManagerEmail } from '../utils/ApiFunctions'; // Import hàm getHotelsByManagerEmail
import RoomTypeSelector from '../common/RoomTypeSelector';
import { Link } from 'react-router-dom';
import '../styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddRoomComponent = () => {
  const [newRoom, setNewRoom] = useState({
    photo: null,
    roomType: "",
    roomPrice: "",
    description: "",
    hotelId: "" // Thêm trường hotelId vào trạng thái
  });
  const [imagePreview, setImagePreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hotels, setHotels] = useState([]);

  // Fetch danh sách khách sạn
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail"); // Hoặc lấy email từ context nếu cần
        const hotelList = await getHotelsByManagerEmail(userEmail);
        setHotels(hotelList);
      } catch (error) {
        setErrorMessage("Error fetching hotels. Please try again.");
      }
    };

    fetchHotels();
  }, []);

  const handleRoomInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "roomPrice") {
      if (!isNaN(value)) {
        value = parseInt(value);
      } else {
        value = "";
      }
    }
    setNewRoom({ ...newRoom, [name]: value });
  };
  

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setNewRoom({ ...newRoom, photo: selectedImage });
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New Room Data:", newRoom); // In ra dữ liệu của phòng mới trước khi gọi API
    try {
      const success = await AddRoom(newRoom.photo, newRoom.roomType, newRoom.roomPrice, newRoom.description, newRoom.hotelId); // Gửi hotelId
      if (success) {
        setSuccessMessage("Room added successfully");
        setNewRoom({ photo: null, roomPrice: "", roomType: "", hotelId: "" });
        setImagePreview("");
      } else {
        setErrorMessage("Error adding room. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <section className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="mt-5 mb-2">Add a new room</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="roomType" className="form-label">Room Type</label>
              <div>
                <RoomTypeSelector handleRoomInputChange={handleRoomInputChange} newRoom={newRoom} />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="roomPrice" className="form-label">Room Price</label>
              <input
                className="form-control"
                required
                id="roomPrice"
                type="number"
                name="roomPrice"
                value={newRoom.roomPrice}
                onChange={handleRoomInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                required
                id="description"
                name="description"
                value={newRoom.description}
                onChange={handleRoomInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">Room Photo</label>
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
                    alt=""
                    style={{ maxWidth: '400px', maxHeight: '400px' }}
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
            <label htmlFor="hotelId" className="form-label">Hotel</label>
            <select
              className="form-select"
              id="hotelId"
              name="hotelId"
              value={newRoom.hotelId}
              onChange={handleRoomInputChange}
              required
            >
              <option value="">Select a hotel</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
              ))}
            </select>
          </div>

            <div className="d-grid d-md-flex mt-2">
              <Link to={"/existing-rooms"} className="btn btn-outline-primary ml-5">
                Back
              </Link>
              <button className="btn btn-outline-primary ml-5" type="submit">Add Room</button>
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

export default AddRoomComponent;
