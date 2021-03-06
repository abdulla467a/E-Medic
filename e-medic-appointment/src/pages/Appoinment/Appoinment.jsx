import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import "./style.css";
import storage from "../../firebase/firebase.storage.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appoinment = () => {
  const { user } = useAuth();
  const { pakId } = useParams();
  const history = useHistory();
  const [appoinments, setAppoinments] = useState([]);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [presUrl, setPresUrl] = useState("");
  const { register, handleSubmit } = useForm();
  const [startDate, setStartDate] = useState(new Date());
  const notify = () => toast.success("Submitted Successfully ");
  const serverUrl = `https://project-101-doctor.herokuapp.com/doctorlist/${pakId}`;
  useEffect(() => {
    fetch(serverUrl)
      .then((res) => res.json())
      .then((data) => setAppoinments(data));
  });
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const storageRef = ref(storage, `/files/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setPresUrl(url);
        });
      }
    );
  };
  const sendDataToServer = (data) => {
    axios.post("https://project-101-doctor.herokuapp.com/users-info", data);
  };
  const onSubmit = (data) => {
    data.Name = user.displayName;
    data.Email = user.email;
    data.Doctor = appoinments.name;
    console.log(presUrl);
    data.url = presUrl;
    data.bmdc = appoinments.bmdc;
    data.apdate = startDate;
    console.log(data);
    setTimeout(sendDataToServer(data), 5000);
    notify();
    setTimeout(() => {
      history.push("/myappoinment");
    }, 1500);
  };

  return (
    <Container className="mt-5">
      <ToastContainer />
      <h2 className="text-center" style={{ fontSize: "50px" }}>
        Get Appointment
      </h2>
      <Row>
        <Col className="mt-2 slide-in-top" lg={6}>
          <img
            src={appoinments.img}
            width="60%"
            height="55%"
            style={{ borderRadius: "50%" }}
            alt="doc-img"
          />
          <div className="mt-4">
            <p>{appoinments.speciality}</p>
            <h5>{appoinments.degree}</h5>
            <p>{appoinments.chember}</p>
            <span>{appoinments.bmdc}</span>
            <p>{appoinments.time}</p>
          </div>
        </Col>
        <Col lg={6}>
          <form
            className="from-container-x mt-5 slide-in-elliptic-top-fwd"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="Doctor"
              defaultValue={appoinments.name}
              {...register("Doctor", {})}
            />
            <input
              type="text"
              defaultValue={user.displayName}
              placeholder="Name"
              {...register("Name", {})}
            />
            <input
              type="email"
              placeholder="Email"
              defaultValue={user.email}
              {...register("Email", {})}
            />
            <input type="number" placeholder="Age" {...register("Age", {})} />
            {/* <input
              type="datetime"
              placeholder="Appoint Date"
              {...register("apdate", {})}
            /> */}
            <DatePicker
              className="w-100"
              {...register("apdate", {})}
              selected={startDate}
              onChange={(date) => {
                setStartDate(date)
              }}
            />
            <input
              type="time"
              placeholder="Appoint Time"
              {...register("aptime", {})}
            />
            <select {...register("gender")}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <br />
            {/* <select {...register("problem")}>
              <option value="Problem1">Problem1</option>
              <option value="Problem2">Problem2</option>
            </select> */}
            <div className="mt-3">
              <div>
                <textarea
                  style={{
                    width: "173%",
                    height: "8rem",
                    border: "1px solid blue",
                    borderRadius: "5px",
                  }}
                  {...register("detail", {})}
                />
              </div>
              <div>
                <p>Upload Previous Prescription (if any) </p>
                <div className="d-flex">
                  <input
                    type="file"
                    accept="images/*"
                    onChangeCapture={handleChange}
                    placeholder="Prescription"
                  />
                  <Button onClick={handleUpload}>Upload</Button>
                </div>
                <span>{progress === 0 ? "" : progress}</span>
                <span>{progress === 0 ? "" : "% upload complete"}</span>
                <br />
                <Button
                  className="roll-in-left btnx"
                  type="Submit"
                  variant="outline-primary"
                >
                  Submit Appointment
                </Button>
              </div>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Appoinment;
