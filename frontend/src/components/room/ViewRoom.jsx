import React, {useEffect, useState} from "react";
import {getRoomById} from "../utils/ApiFunctions";
import {Link, useParams} from "react-router-dom";

const ViewRoom = () => {
    const [room, setRoom] = useState({
        photo: "",
        roomType: "",
        roomPrice: ""
    });

    const [imagePreview, setImagePreview] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const {roomId} = useParams();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const roomData = await getRoomById(roomId);
                setRoom(roomData);
                setImagePreview(roomData.photo);
            } catch (error) {
                console.error(error);
                setErrorMessage("Failed to load room details.");
            }
        };

        fetchRoom();
    }, [roomId]);

    return (
        <div className="container mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="text-center mb-5 mt-5">View Room</h2>

                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label hotel-color">Room Type</label>
                        <p className="form-control-plaintext">{room.roomType}</p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label hotel-color">Room Price</label>
                        <p className="form-control-plaintext">{room.roomPrice}</p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label hotel-color">Photo</label>
                        <div>
                            {imagePreview ? (
                                <img
                                    src={`data:image/jpeg;base64,${imagePreview}`}
                                    alt="Room preview"
                                    style={{maxWidth: "100%", maxHeight: "400px"}}
                                    className="mt-2 img-fluid rounded"
                                />
                            ) : (
                                <p className="form-control-plaintext">No photo available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRoom;
