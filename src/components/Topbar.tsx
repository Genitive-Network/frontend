import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import Image from 'next/image';

export function Topbar() {
  return (
    <Navbar maxWidth="2xl" isBlurred={false} className="bg-transparent">
      <NavbarBrand>
        <Image src="logo.svg" width="42" height="42" alt="logo" />
        <p className="ml-[0.5rem] font-medium">Genitive Network</p>
      </NavbarBrand>
      <NavbarContent className="gap-10 ml-[36rem]" justify="center">
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
            Docs
          </Link>
        </NavbarItem>
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
          <Button as={Link} className="bg-[#c2c2c2] cursor-pointer" href="#" variant="flat">
            Connect Wallet
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
