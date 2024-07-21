import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

import Header from "./Header";

const Main = () => {
  const [trainData, setTrainData] = useState(null);
  const [numSeats, setNumSeats] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toastFunctions = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
  };

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
