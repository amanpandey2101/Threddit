"use client";
import React from "react";
import {
  // useUser,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import Image from "next/image";
import { MenuIcon, ChevronLeftIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import CreatePost from "../post/CreatePost";


const Header = () => {
  const { toggleSidebar, open, isMobile} = useSidebar();
  // const { user } = useUser();
 

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        {open && !isMobile?(
          <ChevronLeftIcon className="w-6 h-6" onClick={toggleSidebar} />
        ):(
          <div className="flex items-center gap-2">
            <MenuIcon className="w-6 h-6" onClick={toggleSidebar} />
            <Image src="/logo.png" alt="logo" width={100} height={100} className="hidden md:block" />
            <Image src="/mobile-logo.png" alt="logo" width={30} height={30} className="block md:hidden" />
          </div>
        )}
        
      </div>
      <div className="flex items-center gap-2">
        <CreatePost/>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button asChild variant="outline" className="cursor-pointer">
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
