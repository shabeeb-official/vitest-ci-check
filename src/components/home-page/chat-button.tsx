import { Button } from "@/components/ui/button";
import { PATHS } from "@/paths";
import { MessageSquare } from "lucide-react";
import { startTransition } from "react";
import { useNavigate } from "react-router-dom";

const ChatButton = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mt-6 mb-12">
      <Button
        onClick={() => startTransition(() => navigate(PATHS.products.root))}
        className="bg-black hover:bg-gray-800 text-white py-3 px-8 text-lg rounded-full"
      >
        <MessageSquare className="mr-2" />
        Let's Chat
      </Button>
    </div>
  );
};

export default ChatButton;
