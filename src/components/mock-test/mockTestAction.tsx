import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDeleteMock } from "@/lib/api/useMockRegister";

interface ActionButtonsProps {
  id: string;
}

const MockActionButtons = ({ id }: ActionButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useDeleteMock();

  const handleConfirmDelete = async () => {
    try {
      await mutateAsync(id);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(`Failed to delete mock test: ${error.message}`);
    }
  };

  const handleDelete = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50  cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete Mock Test</TooltipContent>
      </Tooltip>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 w-full">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6 text-wrap">
              Are you sure you want to delete this student? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                className=" cursor-pointer"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white  cursor-pointer"
                onClick={handleConfirmDelete}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
MockActionButtons.displayName = "MockActionButtons";

export default MockActionButtons;
