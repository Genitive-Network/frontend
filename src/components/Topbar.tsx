'use client';
import { NavItems } from '@/constants';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectModal } from './ConnectModal';
import ShowAccount from './ShowAccount';
import { useEffect, useState } from 'react';

export function Topbar() {
  const pathname = usePathname();
  const { isConnected, address } = useAccount();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Delay render of ShowAccount to avoid "Text content did not match." warning
  if (!hasMounted) {
    return null;
  }

  return (
    <Navbar maxWidth="2xl" isBlurred={false} className="bg-transparent">
      <NavbarBrand>
        <Image src="logo.svg" width="42" height="42" alt="logo" />
        <p className="ml-[0.5rem] font-medium">Genitive Network</p>
      </NavbarBrand>
      <NavbarContent className="gap-10 ml-[36rem]" justify="center">
        {NavItems.map((item) => {
          return (
            <NavbarItem isActive={pathname === item.path} key={item.name}>
              <Link color="foreground" href={item.path}>
                {item.name}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent className="ml-[3rem]" justify="center">
        <NavbarItem>
          <Image src="X.svg" alt="X" width="20" height="20" />
        </NavbarItem>
        <NavbarItem>
          <Image src="discord.svg" alt="discord" width="20" height="20" />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>{isConnected ? <ShowAccount /> : <ConnectModal />}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
