"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";



const Header = () => {
    return ( 
      <Card>
        <CardContent className="p-5 justify-between items-center flex flex-row">
          <Link href="/">
            <Image src="/logo.png" alt="Th Barber" height={18} width={120} />
          </Link>


        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon size={16} />
            </Button>
          </SheetTrigger>

            <SheetContent className="p-0">
              <SideMenu />
            </SheetContent>
         </Sheet>

          
        </CardContent>
      </Card>

     );
}
 
export default Header;