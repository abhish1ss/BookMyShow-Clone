import { axiosInstance } from ".";

export const getAllMovies = async () => {
  try {
    const response = await axiosInstance.get("/movies/getAllMovies");
    return response.data;
  } catch (err) {
    return err.response?.data || { success: false, message: err.message };
  }
};

export const updateMovie = async (payload) => {
  try {
    const response = await axiosInstance.patch("/movies/updateMovie", payload);
    return response.data;
  } catch (err) {
    return err.response?.data || { success: false, message: err.message };
  }
};

export const deleteMovie = async (payload) => {
  try {
    const response = await axiosInstance.delete(
      `/movies/deleteMovie/${payload?.movieId}`
    );
    return response.data;
  } catch (err) {
    return err.response?.data || { success: false, message: err.message };
  }
};

export const addMovie = async (values) => {
  try {
    const response = await axiosInstance.post("/movies/addMovie", values);
    return response.data;
  } catch (err) {
    return err.response?.data || { success: false, message: err.message };
  }
};

export const getMovieById = async (id) => {
  try {
    const response = await axiosInstance.get(`/movies/movie/${id}`);
    return response.data;
  } catch (err) {
    return err.response?.data || { success: false, message: err.message };
  }
};
