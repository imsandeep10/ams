import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useCurrentUser } from "@/lib/api/useUser";
import { useLogout } from "@/lib/api/useAuth";

export const ProfileDropdown = React.memo(() => {
  const { data: currentUser, isLoading } = useCurrentUser();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
    navigate("/", { replace: true });
  };

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format role for display
  const formatRole = (role?: string) => {
    if (!role) return "User";
    const roleMap: Record<string, string> = {
      superAdmin: "Super Admin",
      pteAdmin: "PTE Admin",
      ieltsAdmin: "IELTS Admin",
      duolingoAdmin: "Duolingo Admin",
      satAdmin: "SAT Admin",
      accountant: "Accountant",
    };
    return roleMap[role] || role;
  };

  if(isLoading) {
    return (<div className="w-6 h-6 rounded-full bg-muted animate-spin"></div>)
  }

  // Don't render if user is not loaded
  if (!currentUser) {
    return null;
  }

  const newCurrentUser = currentUser.data;

  const fullName = newCurrentUser.fullName || "unknown user";
  const email = newCurrentUser.email || "unknown email";

  return (
    <>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={newCurrentUser.profileImage || ""}
                  alt={fullName}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {fullName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
                </p>
                <p className="text-xs text-primary font-semibold mt-1">
                  {formatRole(newCurrentUser.role)}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/profile" className="flex items-center w-full">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onSelect={(e) => {
                e.preventDefault();
                setIsLogoutDialogOpen(true);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out from your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

ProfileDropdown.displayName = "ProfileDropdown";
