"use client";
import { Button } from "@/components/ui/button";

import {
  defaultHeight,
  defaultWidth,
  contactHeight,
  contactWidth,
  menuHeight,
  menuWidth,
  Navlinks,
} from "@/lib/constants/db";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/store/user";
import { useGetSession } from "@/lib/supabase/session";
import { toast } from "sonner";
import { useLogOut } from "@/lib/supabase/logout";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [showContact, setShowContact] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user, profile } = useGetSession();

  function handleContactClick() {
    setShowContact((s) => !s);
    if (showMenu) {
      setShowMenu(false);
    }
  }

  function handleMenuClick() {
    setShowMenu((s) => !s);
    if (showContact) {
      setShowContact(false);
    }
  }

  function handleMenuItemClick(n: string) {
    router.push(n);
    setShowMenu((s) => !s);
    if (showContact) {
      setShowContact(false);
    }
  }

  return (
    <nav className="">
      <section
        className={cn(
          "animate-in fixed top-0 left-1/2 -translate-x-1/2 transform",
          "w-96 max-w-2xl border-2 border-neutral-200 rounded-full bg-white my-6 lg:w-full p-4"
        )}
      >
        <div className="flex items-center w-full justify-between">
          <div>
            <Link href={"/"} className="font-medium">
              Time Trace
            </Link>
          </div>
          <div>
            {!user ? null : (
              <div className="flex items-center space-x-4">
                <Link
                  href={"/class"}
                  className={cn(
                    pathname == "/class" && "underline underline-offset-4"
                  )}
                >
                  Class
                </Link>
                <Link
                  href={"/profile"}
                  className={cn(
                    pathname == "/profile" && "underline underline-offset-4"
                  )}
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
          <div>
            {user == null ? (
              <div className="flex items-center space-x-4">
                <Link href={"/login"}>Login</Link>
                <Link href={"/create-account"}>Create Account</Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href={"/profile"}>{profile?.full_name}</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </nav>
  );
}
