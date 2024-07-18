import React, { useEffect, useState } from 'react';
import { getAllRooms } from '../utils/ApiFunctions';
import RoomCard from './RoomCard';
import RoomFilter from '../common/RoomFilter';
import RoomPaginator from '../common/RoomPaginator';
import { Container, Row, Col } from 'react-bootstrap';

const Room = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(6);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        getAllRooms()
            .then((data) => {
                setData(data);
                setFilteredData(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading rooms...</div>;
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>;
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredData.length / roomsPerPage);

    const renderRooms = () => {
        const startIndex = (currentPage - 1) * roomsPerPage;
        const endIndex = Math.min(startIndex + roomsPerPage, filteredData.length);
        const roomChunks = [];
        for (let i = startIndex; i < endIndex; i++) {
            roomChunks.push(filteredData[i]);
        }
        return roomChunks.map((room) => (
            <Col key={room.id} md={12} className="mb-3">
                <RoomCard room={room} />
            </Col>
        ));
    };

    return (
        <Container>
            <Row>
                <Col md={12} className="mb-3">
                    <RoomFilter data={data} setFilteredData={setFilteredData} />
                </Col>
            </Row>
            <Row>
                {renderRooms()}
            </Row>
            <Row>
                <Col md={12} className="d-flex align-items-center justify-content-center">
                    <RoomPaginator 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Room;
