import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faTags,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();

  return (
    <Box
      sx={{ width: 240, bgcolor: "grey.900", color: "white", height: "100vh" }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, marginLeft: 2 }}
        >
          Your App
        </Typography>
      </Box>
      <List>
        <Link
          to="/categories"
          style={{ textDecoration: "none", color: "inherit" }}
          className={location.pathname === "/categories" ? "active" : ""}
        >
          <ListItem button>
            <ListItemIcon>
              <FontAwesomeIcon icon={faTags} />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItem>
        </Link>
        <Link
          to="/products"
          style={{ textDecoration: "none", color: "inherit" }}
          className={location.pathname === "/products" ? "active" : ""}
        >
          <ListItem button>
            <ListItemIcon>
              <FontAwesomeIcon icon={faBoxOpen} />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
        </Link>
        <Link
          to="/transactions"
          style={{ textDecoration: "none", color: "inherit" }}
          className={location.pathname === "/transactions" ? "active" : ""}
        >
          <ListItem button>
            <ListItemIcon>
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItem>
        </Link>
      </List>
    </Box>
  );
};

export default Sidebar;
