import React from "react";
import "./home.css";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  SignInButton,
  SignedIn,
  SignOutButton,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";

const Layout = () => {
  const user = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex h-14 sticky justify-between top-0 w-full bg-gray-700">
      <div className="flex justify-start items-center px-4 py-2 shadow-md">
        <img src="/image.jpg" alt="" className="h-10 w-10" />
      </div>
      <div className="flex items-center justify-end mr-10 w-full h-full bg-gray-700 text-white text-lg font-semibold space-x-2">
        <Button variant="ghost">
          <Link to="/">Home</Link>
        </Button>
        <SignedOut>
          <Button variant="ghost">
            <SignInButton />
          </Button>
        </SignedOut>{" "}
        <Button variant="ghost">
          <button
            onClick={() => {
              if (!user.userId) {
                alert("Please sign in to continue.");
              } else {
                navigate("/host");
              }
            }}
          >
            Host
          </button>
        </Button>
        <SignedIn>
          <Button variant="ghost">
            <SignOutButton signOutCallback={() => navigate("/")} />
          </Button>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Layout;
