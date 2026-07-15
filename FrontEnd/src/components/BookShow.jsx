import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { getShowById } from "../api/show";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Button } from "antd";
import { createCheckoutSession } from "../api/booking";
import { showError } from "../api";
import useApi from "../hooks/useApi";
import { formatShowDate, formatTime } from "../utils/date";

const BookShow = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { user } = useSelector((state) => state.user);
  const { data: show, execute: fetchShow } = useApi(getShowById);

  const getSeats = () => {
    let columns = 12;
    let totalSeats = show.totalSeats;
    let rows = Math.ceil(totalSeats / columns);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">
            Screen this side, you will be watching in this direction
          </p>
          <div className="screen-div"></div>
          <ul className="seat-ul justify-content-center">
            {Array.from(Array(rows).keys()).map((row) => {
              // to be discussed how we are spliting it into multiple rows
              return Array.from(Array(columns).keys()).map((column) => {
                let seatNumber = row * columns + column + 1;
                let seatClass = "seat-btn";
                if (selectedSeats.includes(seatNumber)) {
                  seatClass += " selected";
                }
                if (show.bookedSeats.includes(seatNumber)) {
                  seatClass += " booked";
                }
                if (seatNumber <= totalSeats)
                  return (
                    <li key={seatNumber}>
                      <button
                        onClick={() => {
                          if (!seatClass.split(" ").includes("booked")) {
                            if (selectedSeats.includes(seatNumber)) {
                              setSelectedSeats(
                                selectedSeats.filter(
                                  (curSeatNumber) =>
                                    curSeatNumber !== seatNumber
                                )
                              );
                            } else {
                              setSelectedSeats([...selectedSeats, seatNumber]);
                            }
                          }
                        }}
                        className={seatClass}
                      >
                        {seatNumber}
                      </button>
                    </li>
                  );
              });
            })}
          </ul>
        </div>
      </div>
    );
  };

  const payWithCheckout = async () => {
    try {
      dispatch(showLoading());
      const response = await createCheckoutSession({
        showId: params.id,
        seats: selectedSeats,
        userId: user._id,
      });
      if (response.success && response.data?.url) {
        // hand off to Stripe's hosted payment page
        window.location.href = response.data.url;
      } else {
        showError(response.message || "Unable to start checkout");
      }
    } catch (err) {
      showError(err.message || "Checkout error");
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    fetchShow({ showId: params.id });
  }, []);
  return (
    <div>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div className="movie-title-details">
                  <h1>{show.movie.movieName}</h1>
                  <p>
                    Theatre: {show.theatre.name}, {show.theatre.address}
                  </p>
                </div>
              }
              extra={
                <div className="show-name py-3">
                  <h3>
                    <span>Show Name:</span> {show.name}
                  </h3>
                  <h3>
                    <span>Date & Time: </span>
                    {formatShowDate(show.date)} at {formatTime(show.time)}
                  </h3>
                  <h3>
                    <span>Ticket Price:</span> Rs. {show.ticketPrice}/-
                  </h3>
                  <h3>
                    <span>Total Seats:</span> {show.totalSeats}
                    <span> &nbsp;|&nbsp; Available Seats:</span>
                    {show.totalSeats - show.bookedSeats.length}
                  </h3>
                </div>
              }
              style={{ width: "100%" }}
            >
              {getSeats()}

              {selectedSeats.length > 0 && (
                <div className="max-width-600 mx-auto">
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    block
                    onClick={payWithCheckout}
                  >
                    Pay Now
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BookShow;
