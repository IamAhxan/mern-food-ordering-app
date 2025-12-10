import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "@radix-ui/react-separator";
import { useAuth0 } from "@auth0/auth0-react";

const MobileNavLinks = () => {
  const { logout } = useAuth0();
  return (
    <div className="bg-white w-full">
      <Link
        to="/order-status"
        className="flex bg-white items-center font-bold hover:text-orange-500"
      >
        Order Status
      </Link>
      <Link
        to="/manage-restaurant"
        className="flex bg-white items-center font-bold hover:text-orange-500"
      >
        Manage Restaurant
      </Link>
      <Link
        to="/user-profile"
        className="flex bg-white items-center font-bold hover:text-orange-500"
      >
        User Profile
      </Link>
      <Separator className="my-4" />
      <Button
        variant="ghost"
        className="w-full font-bold bg-slate-700! text-white"
        onClick={() => logout()}
      >
        Logout
      </Button>
    </div>
  );
};

export default MobileNavLinks;
