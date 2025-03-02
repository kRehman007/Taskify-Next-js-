import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <>
      <Loader2 className="animate-spin" />
    </>
  );
};

export default Loader;

export const PageLoader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="animate-spin " />
    </div>
  );
};
