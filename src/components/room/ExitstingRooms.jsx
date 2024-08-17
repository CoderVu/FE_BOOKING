import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { deleteRoom, getHotelsByManagerEmail, getAllRoomsByHotelId, addHotel, updateHotel } from "../utils/ApiFunctions";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
import { FaTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import '../styles/index.css';

const ExistingRooms = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]); // Khởi tạo với mảng rỗng
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [currentHotelId, setCurrentHotelId] = useState(null);

  const userEmail = user?.sub;
  const userRole = user?.roles[0];

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };
  
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setHotelName('');
    setHotelAddress('');
  };

  const handleShowUpdateModal = async () => {
    try {
      const hotelList = await getHotelsByManagerEmail(userEmail);
      setHotels(hotelList);
      setShowUpdateModal(true);
    } catch (error) {
      console.error("Failed to fetch hotels for update:", error);
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setHotelName('');
    setHotelAddress('');
    setCurrentHotelId(null);
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      const response = await addHotel(hotelName, hotelAddress);
      console.log(response.message); // In thông báo thành công ra console
      handleCloseAddModal();
      fetchHotels(userEmail); // Làm mới danh sách khách sạn sau khi thêm mới
    } catch (error) {
      console.error('Failed to add hotel:', error);
    }
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    try {
      const response = await updateHotel(currentHotelId, hotelName, hotelAddress);
      console.log(response.message); // In thông báo thành công ra console
      handleCloseUpdateModal();
      fetchHotels(userEmail); // Làm mới danh sách khách sạn sau khi cập nhật
    } catch (error) {
      console.error('Failed to update hotel:', error);
    }
  };

  useEffect(() => {
    if (userRole === "ROLE_OWNER" && userEmail) {
      fetchHotels(userEmail);
    }
  }, [userRole, userEmail]);

  const fetchHotels = async (managerEmail) => {
    setIsLoading(true);
    try {
      const hotelList = await getHotelsByManagerEmail(managerEmail);
      setHotels(hotelList);
      fetchRoomsForHotels(hotelList);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  const fetchRoomsForHotels = async (hotels) => {
    try {
      const allRooms = [];
      for (const hotel of hotels) {
        const rooms = await getAllRoomsByHotelId(hotel.id);
        rooms.forEach(room => room.hotel = hotel);
        allRooms.push(...rooms);
      }
      setRooms(allRooms);
      setFilteredRooms(allRooms);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.roomType === selectedRoomType);
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  }, [rooms, selectedRoomType]);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete room ${roomId}?`);
    if (confirmDelete) {
      try {
        const result = await deleteRoom(roomId);
        if (result === "") {
          setSuccessMessage(`Room No ${roomId} successfully deleted`);
          fetchHotels(userEmail);
        } else {
          console.error("Error deleting room: " + result.message);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  const calculateTotalPages = (filteredRooms, roomsPerPage) => {
    const totalRooms = filteredRooms.length;
    return Math.ceil(totalRooms / roomsPerPage);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  return (
    <>
      <Button variant="primary" onClick={handleShowAddModal} style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        marginLeft: '20px',
        marginTop: '20px'
      }}>
        Thêm khách sạn
      </Button>
      <Button variant="primary" onClick={() => handleShowUpdateModal(hotels[0])} style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        marginLeft: '20px',
        marginTop: '20px'
      }}>
        Cập nhật khách sạn
      </Button>

      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm khách sạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddHotel}>
            <Form.Group className="mb-3" controlId="hotelName">
              <Form.Label>Tên khách sạn</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter hotel name"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="hotelAddress">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
                required
              />
            </Form.Group>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              marginTop: '20px'
            }}>
              <Button
                variant="secondary"
                onClick={handleCloseAddModal}
                style={{ flex: '1', marginRight: '10px' }}
              >
                Đóng
              </Button>
              <Button
                variant="primary"
                type="submit"
                style={{ flex: '1', marginLeft: '10px' }}
              >
                Thêm
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật khách sạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateHotel}>
            <Form.Group className="mb-3" controlId="hotelSelect">
              <Form.Label>Chọn khách sạn</Form.Label>
              <Form.Control
                as="select"
                value={currentHotelId || ""}
                onChange={(e) => {
                  const selectedHotelId = e.target.value;
                  setCurrentHotelId(selectedHotelId);
                  const selectedHotel = hotels.find(hotel => hotel.id === selectedHotelId);
                  if (selectedHotel) {
                    setHotelName(selectedHotel.name);
                    setHotelAddress(selectedHotel.address);
                  } else {
                    setHotelName('');
                    setHotelAddress('');
                  }
                }}
                required
              >
                <option value="">Chọn một khách sạn</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="hotelName">
              <Form.Label>Tên khách sạn</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter hotel name"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="hotelAddress">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
                required
              />
            </Form.Group>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              marginTop: '20px'
            }}>
              <Button
                variant="secondary"
                onClick={handleCloseUpdateModal}
                style={{ flex: '1', marginRight: '10px' }}
              >
                Đóng
              </Button>
              <Button
                variant="primary"
                type="submit"
                style={{ flex: '1', marginLeft: '10px' }}
              >
                Cập nhật
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
  
      {isLoading ? (
        <p className="text-center">Loading existing-rooms</p>
      ) : (
          <section className="mt-4 mb-4 container-fluid">
             <h2 className="text-center">DANH SÁCH PHÒNG </h2>
          <div className="d-flex justify-content-between mb-3 mt-5">
         
          </div>
          <div className="d-flex justify-content-end mb-3 mt-5">
            <Link to={"/add-room"}>
              {/* <FaPlus />  */}
              <Button variant="primary">Thêm phòng</Button>
            </Link>
          </div>

          <div className="mb-3 mb-md-0">
          <RoomFilter
            data={rooms} 
            setFilteredData={setFilteredRooms}
          />


          </div>
          
        <div className="table-responsive">
            <table className="table table-bordered table-hover text-nowrap">
              <thead className="text-center">
                <tr>
                  <th>ID</th>
                  <th>Hotel Name</th>
                  <th>Room Type</th>
                  <th>Room Price</th>
                  <th>Description </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {currentRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.hotel ? room.hotel.name : 'N/A'}</td>
                  <td>{room.roomType}</td>
                  <td>{room.roomPrice}</td>
                  <td>{room.description}</td>
                  <td className="gap-2 text-center">
                    <Link to={`/view-room/${room.id}`} className="btn btn-info btn-sm me-2">
                      <FaEye /> View
                    </Link>
                    <Link to={`/edit-room/${room.id}`} className="btn btn-warning btn-sm me-2">
                      <FaEdit /> Edit
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(room.id)}>
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          <RoomPaginator
            currentPage={currentPage}
            totalPages={calculateTotalPages(filteredRooms, roomsPerPage)}
            onPageChange={handlePaginationClick}
          />
        </section>
      )}
      {successMessage && (
        <div className="alert alert-success fade show mt-3">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger fade show mt-3">{errorMessage}</div>
      )}
    </>
  );
};

export default ExistingRooms;