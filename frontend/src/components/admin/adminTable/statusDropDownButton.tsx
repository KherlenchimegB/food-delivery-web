import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";

interface DeliveryStatusDropDownButtonProps {
  orderId: string;
  currentStatus: "PENDING" | "CANCELED" | "DELIVERED";
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>;
}

export function DeliveryStatusDropDownButton({ 
  orderId, 
  currentStatus, 
  onStatusChange 
}: DeliveryStatusDropDownButtonProps) {
  const statuses = ["PENDING", "DELIVERED", "CANCELED"] as const;
  
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus !== currentStatus) {
      await onStatusChange(orderId, newStatus);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-none w-5 h-5">
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30 capitalize" align="start">
        <DropdownMenuGroup>
          {statuses.map((status) => (
            <DropdownMenuItem 
              key={status}
              onClick={() => handleStatusChange(status)}
              className={currentStatus === status ? "bg-gray-100" : ""}
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
