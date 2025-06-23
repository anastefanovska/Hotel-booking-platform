import React, { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";

const RoomCarousel = () => {
	const [rooms, setRooms] = useState([{ id: "", roomType: "", roomPrice: "", photo: "" }]);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		getAllRooms()
			.then((data) => {
				setRooms(data);
				setIsLoading(false);
			})
			.catch((error) => {
				setErrorMessage(error.message);
				setIsLoading(false);
			});
	}, []);

	if (isLoading) {
		return <div className="mt-5">Loading rooms...</div>;
	}
	if (errorMessage) {
		return <div className="text-danger mb-5 mt-5">Error: {errorMessage}</div>;
	}

	return (
		<section className="bg-light mb-5 mt-5 shadow">
			<div className="text-center py-3">
				<Link to="/browse-all-rooms" className="hotel-color fw-bold">
					Browse all rooms
				</Link>
			</div>

			<Container>
				<Carousel indicators={false}>
					{[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
						<Carousel.Item key={index}>
							<Row>
								{rooms.slice(index * 4, index * 4 + 4).map((room) => (
									<Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
										<Card className="h-100">
											<Link to={`/book-room/${room.id}`}>
												{room.photo ? (
													<Card.Img
														variant="top"
														src={`data:image/png;base64, ${room.photo}`}
														alt="Room"
														className="w-100"
														style={{ height: "200px", objectFit: "cover" }}
													/>
												) : (
													<Card.Img
														variant="top"
														src="/default-room.jpg" // Place a fallback image in public/
														alt="Default Room"
														className="w-100"
														style={{ height: "200px", objectFit: "cover" }}
													/>
												)}
											</Link>
											<Card.Body className="d-flex flex-column">
												<Card.Title className="hotel-color">{room.roomType}</Card.Title>
												<Card.Text className="mb-2 room-price">${room.roomPrice} / night</Card.Text>
												<div className="mt-auto">
													<Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm w-100">
														Book Now
													</Link>
												</div>
											</Card.Body>
										</Card>
									</Col>
								))}
							</Row>
						</Carousel.Item>
					))}
				</Carousel>
			</Container>
		</section>
	);
};

export default RoomCarousel;
