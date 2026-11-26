"use client"

import { Badge } from '@/components/atoms/Badge/Badge';
import { Divider } from '@/components/atoms/Divider/Divider';
import { LogoutButton } from '@/components/atoms/LogoutButton/LogoutButton';
import { NavigationItem } from '@/components/atoms/NavigationItem/NavigationItem';
import { Dropdown } from '@/components/molecules/Dropdown/Dropdown';
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { UserIcon } from "@/components/silver/Icons"
import { HttpTypes } from "@medusajs/types"
import { useUnreads } from "@talkjs/react"
import { useState } from "react"

export const UserDropdown = ({
  isLoggedIn,
}: {
  isLoggedIn: boolean
}) => {
  const [open, setOpen] = useState(false)

  const unreads = useUnreads()

  return (
    <div
      className="relative"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      <LocalizedClientLink
        href={isLoggedIn ? "/user" : "/login"}
        className="inline-flex h-12 items-center gap-2 rounded-full px-3 text-[17px] font-semibold text-[rgba(var(--brand-900))] hover:bg-[rgba(var(--brand-25))]"
        data-testid="header-account-link"
      >
        <UserIcon size={20} />
        <span className="hidden whitespace-nowrap sm:inline">{isLoggedIn ? "My account" : "Sign in"}</span>
      </LocalizedClientLink>
      <Dropdown show={open}>
        {isLoggedIn ? (
          <div className="p-1">
            <div className="lg:w-[200px]">
              <h3 className="uppercase heading-xs border-b p-4">
                Your account
              </h3>
            </div>
            <NavigationItem href="/user/orders">Orders</NavigationItem>
            {/* <NavigationItem href="/user/messages" className="relative">
              Messages
              {Boolean(unreads?.length) && (
                <Badge className="absolute top-3 left-24 w-4 h-4 p-0">
                  {unreads?.length}
                </Badge>
              )}
            </NavigationItem>
            <NavigationItem href="/user/returns">Returns</NavigationItem> */}
            <NavigationItem href="/user/addresses">Addresses</NavigationItem>
            <Divider />
            <NavigationItem href="/user/settings">Settings</NavigationItem>
            <LogoutButton />
          </div>
        ) : (
          <div className="p-1">
            <NavigationItem href="/login">Sign in</NavigationItem>
            <NavigationItem href="/register">Create an account</NavigationItem>
          </div>
        )}
      </Dropdown>
    </div>
  )
}
