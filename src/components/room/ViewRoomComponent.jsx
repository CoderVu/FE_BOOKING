import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomById } from '../utils/ApiFunctions';
import '../styles/index.css';

const ViewRoomComponent = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomData = await getRoomById(roomId);
        if (roomData) {
          setRoom(roomData);
        } else {
          setErrorMessage('Room not found');
        }
      } catch (error) {
        setErrorMessage('Error fetching room data. Please try again.');
      }
    };

    fetchRoomData();
  }, [roomId]);

  if (errorMessage) {
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5 mb-5">

      <div className="card">
        <img
          src={`data:image/jpeg;base64,${room.photo}`}
          alt="Room"
          className="card-img-top"
          style={{ maxWidth: '100%', maxHeight: '400px' }}
        />
        <div className="card-body">

          <h5 className="card-title">Room Type: {room.roomType}</h5>
          <p  className="card-title">Hotel:  {room.hotel.name}</p>
          <p className="card-title">Price: ${room.roomPrice}</p>
          <p className="card-title">Description: {room.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewRoomComponent;