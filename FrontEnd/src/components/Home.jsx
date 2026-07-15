import { Row, Col, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { getAllMovies } from "../api/movie";
import { useDispatch, useSelector } from "react-redux";
import { setMovies } from "../redux/moviesSlice";
import useApi from "../hooks/useApi";
import { today } from "../utils/date";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const { movies } = useSelector((state) => state.movies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { execute: fetchMovies } = useApi(getAllMovies, {
    onSuccess: (data) => dispatch(setMovies(data)),
  });

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <>
      <Row
        className="justify-content-center w-100"
        style={{ padding: "20px 15px 20px 0px" }}
      >
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Input
            placeholder="Type here to search for movies"
            onChange={handleSearch}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>
      <Row
        className="justify-content-center"
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        {movies &&
          movies
            .filter((movie) =>
              movie.movieName.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((movie) => (
              <Col
                className="gutter-row mb-5"
                key={movie._id}
                span={{
                  xs: 24,
                  sm: 24,
                  md: 12,
                  lg: 10,
                }}
              >
                <div className="text-center">
                  <img
                    onClick={() => {
                      navigate(`/movie/${movie._id}?date=${today()}`);
                    }}
                    className="cursor-pointer"
                    src={movie.poster}
                    alt="Movie Poster"
                    width={200}
                    height={300}
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s",
                      objectFit: "cover",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <h3
                    onClick={() => {
                      navigate(`/movie/${movie._id}?date=${today()}`);
                    }}
                    className="cursor-pointer"
                  >
                    {movie.movieName}
                  </h3>
                </div>
              </Col>
            ))}
      </Row>
    </>
  );
};

export default Home;
