import axios from "../utils/axiosConfig";

export const getHeader = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Hàm này lấy tất cả các phòng từ cơ sở dữ liệu
export async function getAllRooms() {
  try {
    const headers = getHeader(); // Sử dụng hàm getHeader để lấy headers
    console.log("headers:", headers); // Debug: In ra headers
    const result = await axios.get("/api/v1/rooms/all-rooms", { headers });
    return result.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw new Error(`Error fetching rooms: ${error.message}`);
  }
}


// This function adds a new room
export async function AddRoom(photo, roomType, roomPrice, description, hotelId) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);
  formData.append("description", description);
  formData.append("hotelId", hotelId); // Thêm hotelId vào formData
  console.log("FormData to send:");
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  try {
    const headers = getHeader();
    console.log("Headers:", headers);

    const response = await axios.post("/api/v1/rooms/admin/add/new-room", formData, {
      headers: headers
    });

    if (response.status === 200 || response.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error adding room:", error);
    return false;
  }
}

// This function updates a room in the database
export async function updateRoom(roomId, roomData) {
  const formData = new FormData();
  formData.append("roomType", roomData.roomType);
  formData.append("roomPrice", roomData.roomPrice);
  formData.append("photo", roomData.photo);
  formData.append("description", roomData.description);
  try {
    const headers = getHeader(); // Lấy headers từ hàm getHeader()
    console.log(headers); // In ra console.log
    const response = await axios.put(`/api/v1/rooms/admin/update/${roomId}`, formData, {
      headers: headers // Sử dụng headers trong yêu cầu
    });
    return response.data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw new Error("Error updating room");
  }
}

// This function gets all room types from the database
export async function getRoomTypes() {
  try {
    const response = await axios.get("/api/v1/rooms/room/types");
    return response.data;
  } catch (error) {
    console.error("Error fetching room types:", error);
    // Handle the error gracefully
    return []; // Return an empty array or any default value
  }
}



export const getAllHotels = async () => {
  try {
    const response = await axios.get("/api/v1/hotel/all-hotels");
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching hotels: ${error.message}`);
  }
};
export async function getAllRoomsByHotelId(hotelId) {
  try {
    const headers = getHeader();
    console.log('Headers:', headers); // Debug: In headers
    const response = await axios.get(`/api/v1/rooms/all-rooms/${hotelId}`, { headers });
    console.log(`Rooms for hotel ${hotelId}:`, response.data); // Debug: In dữ liệu rooms
    return response.data;
  } catch (error) {
    console.error(`Error fetching rooms for hotel ${hotelId}:`, error); // Debug: In lỗi
    throw new Error(`Error fetching rooms: ${error.message}`);
  }
}

export async function getHotelsByManagerEmail(managerEmail) {
  try {
    const headers = getHeader();
    console.log('Headers:', headers); // Debug: In headers
    const response = await axios.get(`/api/v1/hotel/hotels/managed-by/${managerEmail}`, { headers });
    console.log(`Hotels for manager ${managerEmail}:`, response.data); // Debug: In dữ liệu hotels
    return response.data;
  } catch (error) {
    console.error(`Error fetching hotels for manager ${managerEmail}:`, error); // Debug: In lỗi
    throw new Error(`Error fetching hotels: ${error.message}`);
  }
}

// This function deletes a room from the database
export async function deleteRoom(roomId) {
  try {
    const headers = getHeader(); // Lấy headers từ hàm getHeader()
    console.log(headers); // In ra console.log
    const response = await axios.delete(`/api/v1/rooms/delete/room/${roomId}`, {
      headers: headers // Sử dụng headers trong yêu cầu
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw new Error("Error deleting room");
  }
}



// This function gets a room by its ID
/* This funcction gets a room by the id */
export async function getRoomById(roomId) {
	try {
		const result = await axios.get(`/api/v1/rooms/room/${roomId}`)
		return result.data
	} catch (error) {
		throw new Error(`Error fetching room ${error.message}`)
	}
}


// This function books a room
export async function bookRoom(roomId, booking) {
	try {
    const headers = getHeader(); // Lấy headers từ hàm getHeader()
    console.log(headers); // In ra console.log
		const response = await axios.post(`/api/v1/booking/room/${roomId}/booking`, booking, {
      headers: headers
    });
		return response.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error booking room : ${error.message}`)
		}
	}
}


// Tiếp tục viết hàm getAllBookings
export async function getAllBookings() {
  try {
    const headers = getHeader(); // Lấy headers từ hàm getHeader()
    console.log(headers); // In ra console.log
    const response = await axios.get("/api/v1/booking/all-booking", {
      headers: headers // Sử dụng headers trong yêu cầu
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching bookings: ${error.message}`);
  }
}
// 
// This function gets all bookings by hotel ID
export async function getBookingsByAdminId(adminId) {
  try {
    const headers = getHeader();
    console.log(headers);
    const response = await axios.get(`/api/v1/booking/all-bookingOfOneHotel/${adminId}`, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching bookings: ${error.message}`);
  }
}

// This function gets a booking by its confirmation code
export async function getBookingByConfirmationCode(confirmationCode) {
	try {
    const headers = getHeader(); // Lấy headers từ hàm getHeader()
    console.log(headers); // In ra console.log
		const result = await axios.get(`/api/v1/booking/confirmation/${confirmationCode}`,{
      headers: headers
    });
		return result.data
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data)
		} else {
			throw new Error(`Error find booking : ${error.message}`)
		}
	}
}

// This function cancels a booking
export async function cancelBooking(bookingId) {
  try {
    const headers = getHeader(); // Lấy headers từ hàm getHeader()
    console.log(headers); // In ra console.log
    const response = await axios.delete(`/api/v1/booking/booking/${bookingId}/delete`, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error canceling booking: ${error.message}`);
  }
}

// This function gets available rooms for a given date range and room type
export async function getAvailableRooms(checkInDate, checkOutDate, roomType, address ) {
	const result = await axios.get(`/api/v1/rooms/available-rooms?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}&address=${address}`
	)
	return result
}

// This function registers a new user
export async function registerUser(registration) {
  try {
    const response = await axios.post("/api/v1/auth/user/register-user", registration);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error: ${error.message}`);
    }
  }
}
// this is funtion register a new admin
export async function registerAdmin(registration) {
  try {
    const response = await axios.post("/api/v1/auth/user/register-admin", registration);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error: ${error.message}`);
    }
  }
} 

// This function logs in a registered user
export async function loginUser(login) {
  try {
    const response = await axios.post("/api/v1/auth/user/login", login);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
export const resetPassword = (email) => {
  const headers = getHeader(); 
  console.log(headers); 
  return axios.post('/api/v1/auth/user/reset-password', null, {
    headers: headers, 
    params: {
      email: email
    }
  });
};
// This function confirmResetPassword
export const confirmResetPassword = (email,otp, newPassword) => {
  try {
    const headers = getHeader();
    console.log(headers); 
    const response = axios.post('/api/v1/auth/user/confirm-reset-password', null, {
      headers: headers, 
      params: {
        email: email,
        otp: otp,
        newPassword: newPassword
      }
    });
    return response.data;
  }
  catch (error) {
    console.error("Error confirming password:", error);
    throw new Error("Error confirming password");
  }
};
// This function gets the user profile
export async function getUserProfile(userId) {
  try {
    const headers = getHeader(); // Lấy headers từ hàm getHeader()
    console.log(headers); // In ra console.log
    const response = await axios.get(`/api/v1/users/profile/${userId}`, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// This function deletes a user
export async function deleteUser(userId) {
  try {
    const response = await axios.delete(`/api/v1/users/delete/${userId}`, {
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}

// This function gets a single user
export async function getUser(userId) {
  try {
    const response = await axios.get(`/api/v1/users/${userId}`, {
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// This function gets user bookings by email
export async function getUserBookingsByEmail(email) {
  try {
    const response = await axios.get(`/api/v1/booking/history-booking/email/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching user bookings: ${error.message}`);
  }
}
export async function updateProfileUserById(userId, userData) {
  try {
    const headers = getHeader();
    console.log(headers);
    const response = await axios.post(`/api/v1/auth/user/update-user/${userId}`, userData, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Error updating profile");
  }
}
export const rateRoom = async (userId, roomId, bookingId, starRating, comment) => {
  try {
      const headers = getHeader(); 
      console.log(headers);

      // Kiểm tra và log các giá trị của tham số
      console.log('userId:', userId);
      console.log('roomId:', roomId);
      console.log('bookingId:', bookingId);
      console.log('starRating:', starRating);
      console.log('comment:', comment);

      // Gửi yêu cầu POST với các tham số dạng query
      const response = await axios.post(`/api/v1/ratings/rate`, null, {
          params: {
              userId: userId,
              roomId: roomId,
              bookingId: bookingId,
              starRating: starRating,
              comment: comment
          },
          headers: headers
      });
      return response.data;
  } catch (error) {
      console.error("Error rating room:", error);
      throw new Error("Error rating room");
  }
};
export const getRoomReviews = async (roomId) => {
  try {
    const response = await axios.get(`/api/v1/rooms/room/${roomId}/reviews`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching room reviews: ${error.message}`);
  }
};
export const getHotelByName = async (hotelName) => {
  try {
    const response = await axios.get(`/api/v1/hotel/${hotelName}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      console.error(`Error fetching hotel: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error fetching hotel: No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error fetching hotel:', error.message);
    }
    throw new Error(`Error fetching hotel: ${error.message}`);
  }
}
export const addHotel = async (name, address) => {
  try {
    const headers = getHeader();
    console.log(headers);
    
    const response = await axios.post('/api/v1/hotel/add-hotel', {
      name: name,
      address: address
    }, {
      headers: headers
    });

    return response.data;
  } catch (error) {
    console.error("Error adding hotel:", error);
    throw new Error("Error adding hotel");
  }
};