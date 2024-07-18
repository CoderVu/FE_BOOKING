import React from "react"
import { Row, Col, Card } from "react-bootstrap"
import Header from "./Header"
// Remove the import statement for 'Card' since it is already imported above

import {
	FaClock,
	FaCocktail,
	FaParking,
	FaSnowflake,
	FaTshirt,
	FaUtensils,
	FaWifi
} from "react-icons/fa"

const HotelService = () => {
	return (
		<>
			<div className="mb-2 hotel-color">
				<Row className="mt-4">
					<h4 className="text-center">
						Services at <span className="hotel-color"> VuNguyenCoder - </span>Hotel 24/7 - Hour Front Desk
					</h4>
				</Row>
				<hr />

				<Row xs={1} md={2} lg={3} className="g-4 mt-2">
					<Col>
						<Card className="shadow-sm">
							<Card.Body>
								<Card.Title className="hotel-color"  style={{ color: "rgb(169, 77, 123)" }}>
									<FaWifi /> WiFi
								</Card.Title>
								<Card.Text>Stay connected with high-speed internet access.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Body>
								<Card.Title className="hotel-color" style={{ color: "rgb(169, 77, 123)" }}>
									<FaUtensils /> Breakfast
								</Card.Title>
								<Card.Text>Start your day with a delicious breakfast buffet.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Body>
								<Card.Title className="hotel-color" style={{ color: "rgb(169, 77, 123)" }}>
									<FaTshirt /> Laundry
								</Card.Title>
								<Card.Text>Keep your clothes clean and fresh with our laundry service.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Body> 
								<Card.Title className="hotel-color" style={{ color: "rgb(169, 77, 123)" }}>
									<FaCocktail /> Mini-bar
								</Card.Title>
								<Card.Text>Enjoy a refreshing drink or snack from our in-room mini-bar.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Body>
								<Card.Title className="hotel-color"  style={{ color: "rgb(169, 77, 123)" }}>
									<FaParking /> Parking
								</Card.Title>
								<Card.Text>Park your car conveniently in our on-site parking lot.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Body>
								<Card.Title className="hotel-color"  style={{ color: "rgb(169, 77, 123)" }}>
									<FaSnowflake /> Air conditioning
								</Card.Title>
								<Card.Text>Stay cool and comfortable with our air conditioning system.</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</div>
			<hr />
		</>
	)
}

export default HotelService
