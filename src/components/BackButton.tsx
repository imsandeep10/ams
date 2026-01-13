import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = React.memo(() => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      onClick={() => navigate(-1)}
      className="mb-6 bg-green-200 hover:bg-green-400 cursor-pointer text-green-800"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back
    </Button>
  );
});

export default BackButton;
