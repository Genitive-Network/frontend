import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import Image from 'next/image';

export function Topbar() {
  return (
    <Navbar maxWidth="2xl" isBlurred={false} className="bg-transparent">
      <NavbarBrand>
        <p>Genitive Network</p>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-10" justify="start">
        <NavbarItem isActive>
          <Link color="foreground" href="#">
            HomePage
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            WritePaper
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Bridge & Earn
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Doc
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarItem>
        <Image src="X.svg" alt={''} width="16" height="16"></Image>
      </NavbarItem>
      <NavbarItem>
        <Image src="discord.svg" alt={''} width="16" height="16"></Image>
      </NavbarItem>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} className="bg-[#c2c2c2]" href="#" variant="flat">
            Connect Wallet
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
