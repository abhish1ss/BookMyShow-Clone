import { Table, Button } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTheatresForAdmin, updateTheatre } from "../../api/theatre";
import { setTheatres } from "../../redux/theatresSlice";
import useApi from "../../hooks/useApi";

const TheatreTable = () => {
  const dispatch = useDispatch();
  const { theatres } = useSelector((state) => state.theatres);

  const { execute: getData } = useApi(getAllTheatresForAdmin, {
    onSuccess: (data) => dispatch(setTheatres(data)),
  });

  const { execute: saveStatusChange } = useApi(updateTheatre, {
    successMessage: true,
    onSuccess: () => getData(),
  });

  const handleStatusChange = (theatre) => {
    saveStatusChange({
      ...theatre,
      theatreId: theatre._id,
      isActive: !theatre.isActive,
    });
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text, data) => {
        return data.owner && data.owner.name;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, data) => {
        if (data.isActive) {
          return "Approved";
        } else {
          return "Pending/ Blocked";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, data) => {
        return (
          <div className="d-flex align-items-center gap-10">
            {data.isActive ? (
              <Button onClick={() => handleStatusChange(data)}>Block</Button>
            ) : (
              <Button onClick={() => handleStatusChange(data)}>Approve</Button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Table rowKey="_id" dataSource={theatres} columns={columns} />
    </div>
  );
};

export default TheatreTable;
