import axios from "axios"

export const api = axios.create({
	baseURL: "/api"
});

// Automatically attach token to all requests
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");

	// Skip adding token for login and registration routes
	if (
		!config.url.includes("/auth/login") &&
		!config.url.includes("/auth/register-user") &&
		token
	) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

/* This function adds a new room to the database */
export async function addRoom(photo, roomType, roomPrice) {
	const formData = new FormData()
	formData.append("photo", photo)
	formData.append("roomType", roomType)
	formData.append("roomPrice", roomPrice)

	const response = await api.post("/rooms/add/new-room", formData)
	return response.status === 201
}

/* This function gets all room types from the database */
export async function getRoomTypes() {
	try {
		const response = await api.get("/rooms/room/types")
		return response.data
	} catch (error) {
		throw new Error("Error fetching room types")
	}
}

/* This function gets all rooms from the database */
export async function getAllRooms() {
	try {
		const result = await api.get("/rooms/all-rooms")
		return result.data
	} catch (error) {
		throw new Error("Error fetching rooms")
	}
}

/* This function deletes a room by the Id */
export async function deleteRoom(roomId) {
	try {
		const result = await api.delete(`/rooms/delete/room/${roomId}`)
		return result.data
	} catch (error) {
		throw new Error(`Error deleting room ${error.message}`)
	}
}

/* This function updates a room */
export async function updateRoom(roomId, roomData) {
	const formData = new FormData()
	formData.append("roomType", roomData.roomType)
	formData.append("roomPrice", roomData.roomPrice)
	formData.append("photo", roomData.photo)
	const response = await api.put(`/rooms/update/${roomId}`, formData)
	return response
}

/* This function gets a room by the id */
export async function getRoomById(roomId) {
	try {
		const result = await api.get(`/rooms/room/${roomId}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}

/* This function saves a new booking to the database */
export async function bookRoom(roomId, booking) {
	try {
		const response = await api.post(`/bookings/room/${roomId}/booking`, booking)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}

/* This function gets all bookings from the database */
export async function getAllBookings() {
	try {
		const result = await api.get("/bookings/all-bookings")
		return result.data
	} catch (error) {
		throw new Error(`Error fetching bookings : ${error.message}`)
	}
}

/* This function gets booking by the confirmation code */
export async function getBookingByConfirmationCode(confirmationCode) {
	try {
		const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
		return result.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error finding booking : ${error.message}`)
		}
	}
}

/* This is the function to cancel user booking */
export async function cancelBooking(bookingId) {
	try {
		const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
		return result.data
	} catch (error) {
		throw new Error(`Error cancelling booking :${error.message}`)
	}
}

/* This function gets all available rooms from the database with a given date and a room type */
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
	const result = await api.get(
		`rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
	)
	return result
}

/* This function registers a new user */
export async function registerUser(registration) {
	try {
		const response = await api.post("/auth/register-user", registration)
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`User registration error : ${error.message}`)
		}
	}
}

/* This function logs in a registered user */
export async function loginUser(login) {
	try {
		const response = await api.post("/auth/login", login)
		if (response.status >= 200 && response.status < 300) {
			localStorage.setItem("token", response.data.token) // store token
			return response.data
		} else {
			return null
		}
	} catch (error) {
		console.error(error)
		return null
	}
}

/* This is the function to get the user profile */
export async function getUserProfile(userId) {
	try {
		const response = await api.get(`users/profile/${userId}`)
		return response.data
	} catch (error) {
		throw error
	}
}

/* This is the function to delete a user */
export async function deleteUser(userId) {
	try {
		const response = await api.delete(`/users/delete/${userId}`)
		return response.data
	} catch (error) {
		return error.message
	}
}

/* This is the function to get a single user */
export async function getUser(userId) {
	try {
		const response = await api.get(`/users/${userId}`)
		return response.data
	} catch (error) {
		throw error
	}
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId) {
	try {
		const response = await api.get(`/bookings/user/${userId}/bookings`)
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}
