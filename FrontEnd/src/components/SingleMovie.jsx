import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "../api/movie";
import { Input, Divider, Row, Col } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { getAllTheatresByMovie } from "../api/show";
import useApi from "../hooks/useApi";
import {
  today,
  formatShowDate,
  formatTime,
  compareTimes,
} from "../utils/date";

const SingleMovie = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(today());
  const { data: movie, execute: fetchMovie } = useApi(getMovieById);
  const { data: theatres, execute: fetchTheatres } = useApi(
    getAllTheatresByMovie,
    { initialData: [] }
  );

  const handleDate = (e) => {
    setDate(e.target.value);
    navigate(`/movie/${params.id}?date=${e.target.value}`);
  };

  useEffect(() => {
    fetchMovie(params.id);
  }, []);

  useEffect(() => {
    fetchTheatres({ movie: params.id, date });
  }, [date]);
  return (
    <div className="inner-container" style={{ paddingTop: "20px" }}>
      {movie && (
        <div className="d-flex single-movie-div">
          <div className="flex-Shrink-0 me-3 single-movie-img">
            <img src={movie.poster} width={150} alt="Movie Poster" />
          </div>
          <div className="w-100">
            <h1 className="mt-0">{movie.movieName}</h1>
            <p className="movie-data">
              Language: <span>{movie.language}</span>
            </p>
            <p className="movie-data">
              Genre: <span>{movie.genre}</span>
            </p>
            <p className="movie-data">
              Release Date:
              <span>{formatShowDate(movie.releaseDate)}</span>
            </p>
            <p className="movie-data">
              Duration: <span>{movie.duration} Minutes</span>
            </p>
            <hr />
            <div className="d-flex flex-column-mob align-items-center mt-3">
              <label className="me-3 flex-shrink-0">Choose the date:</label>
              <Input
                onChange={handleDate}
                type="date"
                min={today()}
                className="max-width-300 mt-8px-mob"
                value={date}
                placeholder="default size"
                prefix={<CalendarOutlined />}
              />
            </div>
          </div>
        </div>
      )}
      {theatres.length === 0 && (
        <div className="pt-3">
          <h2 className="blue-clr">
            Currently, no theatres available for this movie!
          </h2>
        </div>
      )}
      {theatres.length > 0 && (
        <div className="theatre-wrapper mt-3 pt-3">
          <h2>Theatres</h2>
          {theatres.map((theatre) => {
            return (
              <div key={theatre._id}>
                <Row gutter={24} key={theatre._id}>
                  <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                    <h3>{theatre.name}</h3>
                    <p>{theatre.address}</p>
                  </Col>
                  <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                    <ul className="show-ul">
                      {theatre.shows
                        .sort((a, b) => compareTimes(a.time, b.time))
                        .map((singleShow) => {
                          return (
                            <li
                              key={singleShow._id}
                              onClick={() =>
                                navigate(`/book-show/${singleShow._id}`)
                              }
                            >
                              {formatTime(singleShow.time)}
                            </li>
                          );
                        })}
                    </ul>
                  </Col>
                </Row>
                <Divider />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SingleMovie;
