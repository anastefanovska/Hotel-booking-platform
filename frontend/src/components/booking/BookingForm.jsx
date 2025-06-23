import React, { useEffect, useState } from "react";
import moment from "moment";
import { Form, FormControl, Button, Row, Col } from "react-bootstrap";
import BookingSummary from "./BookingSummary";
import { bookRoom, getRoomById } from "../utils/ApiFunctions";
import { useNavigate, useParams } from "react-router-dom";

const BookingForm = () => {
	const [validated, setValidated] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [roomPrice, setRoomPrice] = useState(0);

	const currentUser = localStorage.getItem("userId");

	const [booking, setBooking] = useState({
		guestFullName: "",
		guestEmail: currentUser,
		checkInDate: "",
		checkOutDate: "",
		numOfAdults: "",
		numOfChildren: ""
	});

	const { roomId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		getRoomById(roomId)
			.then((response) => setRoomPrice(response.roomPrice))
			.catch((error) => console.error(error));
	}, [roomId]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setBooking({ ...booking, [name]: value });
		setErrorMessage("");
	};

	const calculatePayment = () => {
		const checkIn = moment(booking.checkInDate);
		const checkOut = moment(booking.checkOutDate);
		const days = checkOut.diff(checkIn, "days");
		return days * (roomPrice || 0);
	};

	const isGuestCountValid = () => {
		const adults = parseInt(booking.numOfAdults);
		const children = parseInt(booking.numOfChildren);
		return adults >= 1 && (adults + children >= 1);
	};

	const isCheckOutDateValid = () => {
		if (!moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))) {
			setErrorMessage("Check-out date must be after check-in date");
			return false;
		}
		return true;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!e.currentTarget.checkValidity() || !isGuestCountValid() || !isCheckOutDateValid()) {
			e.stopPropagation();
			setValidated(true);
			return;
		}
		setIsSubmitted(true);
		setValidated(true);
	};

	const handleFormSubmit = async () => {
		try {
			const code = await bookRoom(roomId, booking);
			navigate("/booking-success", { state: { message: code } });
		} catch (error) {
			navigate("/booking-success", { state: { error: error.message } });
		}
	};

	return (
		<div className="container mb-5">
			<div className="row">
				<div className="col-lg-6 col-md-10 mb-4">
					<div className="card card-body mt-5 shadow">
						<h4 className="card-title mb-4">Reserve Room</h4>

						<Form noValidate validated={validated} onSubmit={handleSubmit}>
							<Form.Group className="mb-3">
								<Form.Label className="hotel-color">Full name</Form.Label>
								<FormControl
									required
									type="text"
									name="guestFullName"
									value={booking.guestFullName}
									placeholder="Enter your full name"
									onChange={handleInputChange}
								/>
								<Form.Control.Feedback type="invalid">
									Please enter your full name.
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-4">
								<Form.Label className="hotel-color">Email</Form.Label>
								<FormControl
									required
									type="email"
									name="guestEmail"
									value={booking.guestEmail}
									placeholder="Enter your email"
									onChange={handleInputChange}
									disabled
								/>
								<Form.Control.Feedback type="invalid">
									Please enter a valid email address.
								</Form.Control.Feedback>
							</Form.Group>

							<fieldset className="mb-4">
								<legend className="mb-3">Lodging period</legend>
								<Row>
									<Col md={6} className="mb-3">
										<Form.Label className="hotel-color">Check-in date</Form.Label>
										<FormControl
											required
											type="date"
											name="checkInDate"
											value={booking.checkInDate}
											min={moment().format("YYYY-MM-DD")}
											onChange={handleInputChange}
										/>
										<Form.Control.Feedback type="invalid">
											Please select a check-in date.
										</Form.Control.Feedback>
									</Col>
									<Col md={6} className="mb-3">
										<Form.Label className="hotel-color">Check-out date</Form.Label>
										<FormControl
											required
											type="date"
											name="checkOutDate"
											value={booking.checkOutDate}
											min={moment().format("YYYY-MM-DD")}
											onChange={handleInputChange}
										/>
										<Form.Control.Feedback type="invalid">
											Please select a check-out date.
										</Form.Control.Feedback>
									</Col>
								</Row>
								{errorMessage && <p className="text-danger">{errorMessage}</p>}
							</fieldset>

							<fieldset className="mb-4">
								<legend className="mb-3">Number of guests</legend>
								<Row>
									<Col md={6} className="mb-3">
										<Form.Label className="hotel-color">Adults</Form.Label>
										<FormControl
											required
											type="number"
											name="numOfAdults"
											value={booking.numOfAdults}
											min={1}
											placeholder="0"
											onChange={handleInputChange}
										/>
										<Form.Control.Feedback type="invalid">
											Please enter at least 1 adult.
										</Form.Control.Feedback>
									</Col>
									<Col md={6} className="mb-3">
										<Form.Label className="hotel-color">Children</Form.Label>
										<FormControl
											required
											type="number"
											name="numOfChildren"
											value={booking.numOfChildren}
											min={0}
											placeholder="0"
											onChange={handleInputChange}
										/>
										<Form.Control.Feedback type="invalid">
											Select 0 if no children.
										</Form.Control.Feedback>
									</Col>
								</Row>
							</fieldset>

							<div className="text-end">
								<Button type="submit" className="btn-hotel">
									Continue
								</Button>
							</div>
						</Form>
					</div>
				</div>

				{isSubmitted && (
					<div className="col-lg-6 col-md-10">

							<BookingSummary
								booking={booking}
								payment={calculatePayment()}
								onConfirm={handleFormSubmit}
								isFormValid={validated}
							/>

					</div>
				)}
			</div>
		</div>
	);
};

export default BookingForm;
