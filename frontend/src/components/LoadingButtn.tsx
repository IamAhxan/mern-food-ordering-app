import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

function LoadingButtn() {
  return (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin bg-slate-700! text-black! " />
      Loading...
    </Button>
  );
}

export default LoadingButtn;
