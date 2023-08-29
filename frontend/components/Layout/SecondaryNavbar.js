import { useRouter } from 'next/router'
import { useState } from 'react'
import { Input, Menu } from 'semantic-ui-react'

const SecondaryNavbar = ({}) => {
    const [activeItem, setActiveItem] = useState('social')
    const router = useRouter();

    const   handleItemClick = (e, { name }) => {
      setActiveItem(name.toLowerCase());
      if (name === "Social") router.push("/");
      else if (name == "Freelance Tool") router.push("/tool");
      else  router.push("/" + name.toLowerCase());
    }

    return (
      <Menu secondary>
        <Menu.Item className='logo' name='logo' active={activeItem == "Logo"} onClick={e=> router.push("/")} >
            <img src='https://res.cloudinary.com/diutgjcc8/image/upload/v1690783448/social_media/assets/flaticon-removebg-preview_cullvy.png' alt='logo' style={{width: "50px"}} />
        </Menu.Item>
        <Menu.Item
          name='Social'
          active={activeItem === 'social'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='Freelance'
          active={activeItem === 'freelance'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='Freelance Tool'
          active={activeItem === 'tool'}
          onClick={handleItemClick}
        />
      </Menu>
    );
}

export default SecondaryNavbar;
