import { Button, Card, Col, Row } from "antd";
import { useEffect } from "react";
import { getAllBookings } from "../../api/booking";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { formatShowDate, formatTime } from "../../utils/date";

const Booking = () => {
  const { data: bookings, execute: fetchBookings } = useApi(getAllBookings, {
    initialData: [],
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      {bookings && (
        <Row gutter={24}>
          {bookings.map((booking) => {
            return (
              <Col key={booking._id} xs={{ span: 24 }} lg={{ span: 12 }}>
                <Card className="mb-3">
                  <div className="d-flex flex-column-mob">
                    <div className="flex-shrink-0">
                      <img
                        src={booking.show.movie.poster}
                        width={100}
                        alt="Movie Poster"
                      />
                    </div>
                    <div className="show-details flex-1">
                      <h3 className="mt-0 mb-0">
                        {booking.show.movie.movieName}
                      </h3>
                      <p>
                        Theatre: <b>{booking.show.theatre.name}</b>
                      </p>
                      <p>
                        Seats: <b>{booking.seats.join(", ")}</b>
                      </p>
                      <p>
                        Date & Time:
                        <b>
                          {formatShowDate(booking.show.date)}{" "}
                          {formatTime(booking.show.time)}
                        </b>
                      </p>
                      <p>
                        Amount:
                        <b>
                          Rs.{booking.seats.length * booking.show.ticketPrice}
                        </b>
                      </p>
                      <p>
                        Booking ID: <b>{booking.transactionId} </b>
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {!bookings.length && (
        <div className="text-center pt-3">
          <h1>You've not booked any show yet!</h1>
          <Link to="/">
            <Button type="primary">Start Booking</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Booking;
