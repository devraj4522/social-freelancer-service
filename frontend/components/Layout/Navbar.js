import { Menu, Container, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";

function Navbar({demo}) {
  const router = useRouter();

  const isActive = route => router.pathname === route;

  return (
    <Menu fluid borderless className="navbar">
      <Container text={demo === false} style={{alignItems: "center"}}>
        <Link href={demo ? "/login" : "/demo"}>
        <Menu.Item header>
          <img src='https://res.cloudinary.com/diutgjcc8/image/upload/v1690783448/social_media/assets/flaticon-removebg-preview_cullvy.png' alt='logo' style={{width: "50px"}} />
        </Menu.Item>
        </Link>
        <Link href="/login">
          <Menu.Item header active={isActive("/login")}>
            <Icon size="large" name="sign in" />
            Login
          </Menu.Item>
        </Link>

        <Link href="/signup">
          <Menu.Item header active={isActive("/signup")}>
            <Icon size="large" name="signup" />
            Signup
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
}

export default Navbar;
