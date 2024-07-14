import React, { useEffect, useState } from "react";
import { deleteRoom, getAllRooms } from "../utils/ApiFunctions";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
import { FaTrashAlt, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import '../styles/index.css'
const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      setRooms(result);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
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
          fetchRooms();
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
      {isLoading ? (
        <p className="text-center">Loading existing rooms</p>
      ) : (
        <section className="mt-5 mb-5 container">
          <div className="d-flex justify-content-between mb-3 mt-5">
            <h2>Existing Rooms</h2>
          </div>
          <div className="d-flex justify-content-end mb-3 mt-5">
            <Link to={"/add-room"}>
              <FaPlus /> Add room
            </Link>
          </div>

          <div className="mb-3 mb-md-0">
            <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="text-center">
                <tr>
                  <th>ID</th>
                  <th>Room Type</th>
                  <th>Room Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{room.roomType}</td>
                    <td>{room.roomPrice}</td>
                    <td>{room.description}</td>
                    <td className="gap-2 text-center">
                      <Link to={"/edit-room/" + room.id} className="btn btn-info btn-sm me-2">
                        <FaEye /> View
                      </Link>
                      <Link to={"/edit-room/" + room.id} className="btn btn-warning btn-sm me-2">
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
