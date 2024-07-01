'use client'
import { NavIcons, NavItems } from '@/constants'
import { cls } from '@/utils/helpers'
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectModal } from './ConnectModal'
import ShowAccount from './ShowAccount'

export function Topbar() {
  const pathname = usePathname()
  const { isConnected, address } = useAccount()
  const [hasMounted, setHasMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Delay render of ShowAccount to avoid "Text content did not match." warning
  if (!hasMounted) {
    return null
  }

  return (
    <Navbar
      maxWidth="lg"
      onMenuOpenChange={setIsMenuOpen}
      isBlurred={false}
      className="bg-transparent"
    >
      <NavbarMenuToggle
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="lg:hidden"
      />
      <NavbarBrand>
        <Image src="logo.svg" width="42" height="42" alt="logo" />
        <p className="ml-[0.5rem] font-medium">Genitive Network</p>
      </NavbarBrand>

      <NavbarContent
        className="gap-10 hidden lg:flex lg:ml-[15rem] 2xl:ml-[36rem]"
        justify="center"
      >
        {NavItems.map(item => {
          return (
            <NavbarItem isActive={pathname === item.path} key={item.name}>
              <Link color="foreground" href={item.path}>
                {item.name}
              </Link>
            </NavbarItem>
          )
        })}
      </NavbarContent>

      <NavbarContent justify="end" className="ml-4">
        {NavIcons.map((item, index) => 
          <NavbarItem key={item.name} className={cls(["shrink-0 hidden md:flex", index === 0 && ' ml-[3rem]'])}>
            <Link href={item.href}>
              <Image src={item.img} alt={item.name} width="20" height="20" />
            </Link>
          </NavbarItem>
        )}
        
        <NavbarItem>
          {isConnected ? <ShowAccount /> : <ConnectModal />}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {NavItems.map((item, index) => 
          <NavbarMenuItem key={index}>
            <Link
              color='foreground'
              className="w-full my-4 font-medium text-lg"
              href={item.path}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        )}
        {NavIcons.map((item,index) => (
          <NavbarMenuItem key={index}>
            <Link
              color='foreground'
              className="w-full my-4 font-medium text-lg"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
