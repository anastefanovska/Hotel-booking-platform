import { format, isValid } from "date-fns";
import React, { useState, useEffect } from "react";
import DateSlider from "../common/DateSlider";

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
	const [filteredBookings, setFilteredBookings] = useState(bookingInfo);

	const filterBookings = (startDate, endDate) => {
		if (!startDate || !endDate) {
			setFilteredBookings(bookingInfo);
			console.log("Filter cleared: showing all bookings");
			return;
		}

		const start = new Date(startDate.setHours(0, 0, 0, 0));
		const end = new Date(endDate.setHours(0, 0, 0, 0));

		console.log("Filtering bookings between:", start.toISOString(), "and", end.toISOString());

		const filtered = bookingInfo.filter((booking) => {
			console.log("Raw date strings:", booking.checkInDate, booking.checkOutDate);

			const checkIn = new Date(booking.checkInDate);
			const checkOut = new Date(booking.checkOutDate);

			console.log("Booking:", booking.id, "Check-in:", checkIn, "Check-out:", checkOut);

			if (!isValid(checkIn) || !isValid(checkOut)) return false;

			checkIn.setHours(0, 0, 0, 0);
			checkOut.setHours(0, 0, 0, 0);

			const overlaps = checkIn <= end && checkOut >= start;
			console.log("  -> Overlaps:", overlaps);
			return overlaps;
		});

		console.log("Filtered bookings count:", filtered.length);
		setFilteredBookings(filtered);
	};

	useEffect(() => {
		setFilteredBookings(bookingInfo);
	}, [bookingInfo]);

	const confirmAndCancelBooking = (bookingId) => {
		const confirmed = window.confirm("Are you sure you want to cancel this booking?");
		if (confirmed) {
			handleBookingCancellation(bookingId);
		}
	};

	const formatDate = (dateString) => {
		try {
			const date = new Date(dateString);
			return isValid(date) ? format(date, "MMM dd, yyyy") : dateString;
		} catch {
			return dateString;
		}
	};

	return (
		<section className="p-4">
			<DateSlider onDateChange={filterBookings} />

			{filteredBookings.length === 0 ? (
				<p>No bookings found for the selected dates.</p>
			) : (
				<table className="table table-bordered table-hover shadow">
					<thead className="text-center">
					<tr>
						<th>S/N</th>
						<th>Booking ID</th>
						<th>Room ID</th>
						<th>Room Type</th>
						<th>Check-In Date</th>
						<th>Check-Out Date</th>
						<th>Guest Name</th>
						<th>Guest Email</th>
						<th>Adults</th>
						<th>Children</th>
						<th>Total Guests</th>
						<th>Confirmation Code</th>
						<th>Actions</th>
					</tr>
					</thead>
					<tbody className="text-center">
					{filteredBookings.map((booking, index) => (
						<tr key={booking.id}>
							<td>{index + 1}</td>
							<td>{booking.id}</td>
							<td>{booking.room.id}</td>
							<td>{booking.room.roomType}</td>
							<td>{formatDate(booking.checkInDate)}</td>
							<td>{formatDate(booking.checkOutDate)}</td>
							<td>{booking.guestName}</td>
							<td>{booking.guestEmail}</td>
							<td>{booking.numOfAdults}</td>
							<td>{booking.numOfChildren}</td>
							<td>{booking.totalNumOfGuests}</td>
							<td>{booking.bookingConfirmationCode}</td>
							<td>
								<button
									className="btn btn-danger btn-sm"
									onClick={() => confirmAndCancelBooking(booking.id)}
								>
									Cancel
								</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
		</section>
	);
};

export default BookingsTable;
