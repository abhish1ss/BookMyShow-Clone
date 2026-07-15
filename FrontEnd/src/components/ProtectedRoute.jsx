import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { GetCurrentUser, LogoutUser } from "../api/user";
import { setUser } from "../redux/userSlice";
import { Layout, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    {
      key: "home",
      label: (
        <span
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          Home
        </span>
      ),
      icon: <HomeOutlined />,
    },
    {
      key: "profile",
      label: `${user ? user.name : ""}`,
      icon: <UserOutlined />,
      children: [
        {
          label: (
            <span
              onClick={() => {
                if (user.role === "admin") {
                  navigate("/admin", { replace: true });
                } else if (user.role === "partner") {
                  navigate("/partner", { replace: true });
                } else {
                  navigate("/profile", { replace: true });
                }
              }}
            >
              My Profile
            </span>
          ),
          icon: <ProfileOutlined />,
        },
        {
          key: "logout",
          label: (
            <Link
              to="/login"
              onClick={async () => {
                await LogoutUser();
                dispatch(setUser(null));
              }}
            >
              Log out
            </Link>
          ),
          icon: <LogoutOutlined />,
        },
      ],
    },
  ];

  const getValidUser = async () => {
    try {
      dispatch(showLoading());
      // the session lives in an httpOnly cookie, so the only way to know if
      // the user is logged in is to ask the backend
      const response = await GetCurrentUser();
      if (response?.success) {
        dispatch(setUser(response.data));
      } else {
        dispatch(setUser(null));
        navigate("/login");
      }
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getValidUser();
  }, []);
  return (
    user && (
      <>
        <Layout>
          <Header
            className="d-flex justify-content-between"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              alignItems: "center",
            }}
          >
            <h3
              className="text-white m-0"
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            >
              Book My Show
            </h3>
            <Menu theme="dark" mode="horizontal" items={navItems} />
          </Header>
        </Layout>
        <div>{children}</div>
      </>
    )
  );
};

export default ProtectedRoute;
