import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import {
  format,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  differenceInSeconds,
} from "date-fns";
import { toDate } from "date-fns-tz";
import Header from "./Header";

const Main = () => {
  const [trainData, setTrainData] = useState(null);
  const [numSeats, setNumSeats] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  const toastFunctions = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
  };

  const getNextResetTime = () => {
    const now = new Date();
    let nextReset = new Date();
    nextReset = setHours(nextReset, 0); // 12 AM IST is 0 UTC+5:30
    nextReset = setMinutes(nextReset, 40);
    nextReset = setSeconds(nextReset, 0);

    // Convert next reset time to UTC
    nextReset = toDate(nextReset, "Asia/Kolkata");

    // If the time has already passed today, set it for tomorrow
    if (now > nextReset) {
      nextReset = addDays(nextReset, 1);
    }

    return nextReset;
  };

  const formatTimeRemaining = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateCountdown = () => {
      const nextReset = getNextResetTime();
      const now = new Date();
      const timeDistanceInSeconds = differenceInSeconds(nextReset, now);
      setTimeRemaining(formatTimeRemaining(timeDistanceInSeconds));
    };

    // Update countdown immediately and every second
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchTrainData = async () => {
      await axios
        .get("/api/train")
        .then(function (response) {
          const data = response.data;
          setTrainData(data.train);
        })
        .catch(function (error) {
          console.log("Fetch Train Data failed: ", error.message);
          const selectedToast = toastFunctions[error.status] || toast;
          selectedToast(error.message);
        });
    };
    fetchTrainData();
  }, []);

  const handleBookSeats = async () => {
    const userData = JSON.parse(localStorage.getItem("user")) || { id: null };

    // Send booking request to backend
    await axios
      .post(
        "/api/train",
        { numSeats },
        {
          headers: {
            "user-id": userData.id,
          },
        }
      )
      .then(async function (response) {
        const data = response.data;

        toast.success(`Booked Seat No: ${data.seats.join(", ")}`, {
          position: "top-right",
          theme: "colored",
        });

        setNumSeats("");

        const { data: newData } = await axios.get("/api/train");
        setTrainData(newData.train);
      })
      .catch(function (error) {
        console.log("Booking seates failed: ", error.message);
        const selectedToast = toastFunctions[error.status] || toast;
        selectedToast(error.message);
      });
  };

  const handleInputChange = (event) => {
    const inputValue = parseInt(event.target.value) || "";
    if (inputValue < 1 || inputValue > 7) {
      setErrorMessage("Seats should be booked in a range of 1 - 7");

      setNumSeats("");
    } else {
      setNumSeats(inputValue);

      setErrorMessage("");
    }
  };

  if (!trainData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto mt-5 flex flex-col md:flex-row items-center">
        <div className="max-w-md mx-auto md:max-w-2xl text-center">
          <h2 className="text-2xl text-[#ee5e5f] font-bold mb-14 pb-2 border-b border-[#eca74e4f] flex flex-col md:flex-row md:items-center md:justify-center">
            <span>Train Seat Booking System </span>
            <p>
              Data reset At [12:40 A.M]{" "}
              <span className="text-yellow-400">{timeRemaining}</span>
            </p>
          </h2>

          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                src="https://i.imgur.com/ilDN4RY.png"
                alt="Train_image"
                className="w-48 h-48 md:h-full md:w-64 mx-auto"
              />
            </div>
            <div className="p-8 md:mt-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold cursor-default">
                Train Coach: S1
              </div>
              <p className="block mt-1 text-lg leading-tight font-medium text-white hover:underline cursor-default">
                Train Number: 000000
              </p>
              <p className="mt-2 text-gray-500">
                Source <i className="fa-solid fa-arrow-right mx-2"></i>{" "}
                Destination
              </p>
            </div>
          </div>
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
          <input
            className="appearance-none border rounded lg:w-1/2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-5"
            id="numSeats"
            type="number"
            placeholder="Enter number of seats max 7"
            min="1"
            max="7"
            value={numSeats}
            onChange={handleInputChange}
          />
          <div className="flex justify-between items-center">
            <button
              className="bg-[#eca74e] hover:bg-[#ee5e5f] duration-200 text-black font-bold py-2 px-4 rounded mt-5  mx-auto block"
              onClick={handleBookSeats}
            >
              Book Seats
            </button>
          </div>
        </div>
        <div className=" mx-auto w-11/12 lg:w-8/12 md:ml-5 mt-5 md:mt-0">
          <div className="max-w-md mx-auto bg-black rounded-xl shadow-md overflow-hidden mb-5">
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-center items-center">
                  <i className="fa-solid fa-couch text-green-500"></i>
                  <span className="ml-2 text-sm text-green-500">Available</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-couch text-red-500"></i>
                  <span className="ml-2 text-sm text-red-500">Booked</span>
                </div>
              </div>
            </div>
          </div>
          <div className=" mx-auto bg-black rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4">
              <div className="text-white text-center">
                Seat Number Display Here
              </div>
              <br />
              <div className="grid grid-cols-10 gap-1 justify-center text-center">
                {trainData.coach.seats.map((seat) => (
                  <div key={seat.number}>
                    {seat.isBooked ? (
                      <i className="fa-solid fa-couch text-red-500"></i>
                    ) : (
                      <i className="fa-solid fa-couch text-green-500"></i>
                    )}
                    <div className="text-sm text-white">{seat.number}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
