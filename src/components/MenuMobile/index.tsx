import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '../ButtonComponent';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SideMenu from '../SideMenu';
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { Logout } from '@mui/icons-material';
import { useRouter } from 'next/router';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function MenuMobile(){
    const router = useRouter();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

    const logout = () => {
        const startInfo: any = localStorage.getItem('startInfo') || false;
        localStorage.clear();
        localStorage.setItem('startInfo', startInfo);
        router.push('/');
    };

    const list = (anchor: Anchor) => (
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
            {['Fechar'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon style={{minWidth: '40px'}}>
                    <CloseIcon/>
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>

              </ListItem>
            ))}
          </List>

          <Divider />

          <List>
            {['Sair'].map((text, index) => (
              <ListItem key={text} onClick={logout} disablePadding>
                <ListItemButton>
                  <ListItemIcon style={{minWidth: '40px'}}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>

              </ListItem>
            ))}
          </List>
          
          {/* <List>
            {['Link', 'Link', 'Link'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <NavigateNextIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}
          {/* <SideMenu categoria="imóvel" /> */}
        </Box>
      );

    return(
        <div className="mobile-nav">
            <nav>
                {(['left'] as const).map((anchor) => (
                    <React.Fragment key={anchor}>
                      <Button 
                        name="minimal"
                        size="medium" 
                        label="Menu" 
                        startIcon={<MenuIcon className="icon icon-right" />}
                        endIcon={""}
                        disabled={false}
                        error={false} 
                        variant="text"
                        onClick={toggleDrawer(anchor, true)}
                      />
                      <Drawer
                          className="drawer-nav-mobile"
                          anchor={anchor}
                          open={state[anchor]}
                          onClose={toggleDrawer(anchor, false)}
                      >
                          {list(anchor)}

                          Teste
                      </Drawer>
                    </React.Fragment>
                ))}
            </nav>
        </div>
               
    )
}