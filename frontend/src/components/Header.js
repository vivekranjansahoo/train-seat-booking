import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    nav("/");
  };

  if (user) {
    const firstName = user.fullName.split(" ")[0];

    return (
      // Header when logged in
      <div className="flex justify-between xl:justify-end space-x-2 mx-4 mt-1 md:-mb-2">
        <span className="text-[#000]  hover:bg-white px-4 py-2 border hover:border-[#f2f2f2] rounded-full transition duration-300 focus:outline-none focus:ring bg-[#20ffe1] focus:border-blue-300 cursor-default max-w-[8rem] truncate">
          {firstName}
        </span>
        <span
          onClick={handleLogout}
          className="text-[#000]  hover:bg-white px-4 py-2 border hover:border-[#eca74e] rounded-full transition duration-300 focus:outline-none focus:ring bg-[#f85f92] focus:border-blue-300 cursor-pointer"
        >
          Log Out
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-between xl:justify-end space-x-2 mx-4 mt-1 -mb-2">
      <Link
        to="/login"
        className="text-[#000] hover:bg-white px-4 py-2 border hover:border-[#ffffff] rounded-full transition duration-300 focus:outline-none focus:ring bg-[#20ffe1] focus:border-blue-300"
      >
        Log In
      </Link>
      <Link
        to="/signup"
        className="text-[#000]  hover:bg-white px-4 py-2 border hover:border-[#eca74e] rounded-full transition duration-300 focus:outline-none focus:ring bg-[#f85f92] focus:border-blue-300"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default Header;
