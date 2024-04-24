'use client';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectModal } from './ConnectModal';

interface NavItem {
  name: string;
  path: string;
}

export function Topbar() {
  const NavItems: NavItem[] = [
    { name: 'HomePage', path: '/' },
    { name: 'WritePaper', path: '/whitepaper' },
    { name: 'Bridge & Earn', path: '/bridge' },
    { name: 'Docs', path: '/docs' },
  ];

  const pathname = usePathname();

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
        <NavbarItem>
          <ConnectModal />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
