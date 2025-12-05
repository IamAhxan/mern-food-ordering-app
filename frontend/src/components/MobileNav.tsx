import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "./ui/button";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-orange-500" />
      </SheetTrigger>
      <SheetContent className="space-y-3">
        <SheetHeader>
          <SheetTitle>
            <span>Welcome to MernEats.com!</span>
          </SheetTitle>

          <Separator />
          <SheetDescription className="flex">
            <Button
              variant="ghost"
              className="flex-1 font-bold bg-orange-500! text-white"
            >
              Login
            </Button>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
