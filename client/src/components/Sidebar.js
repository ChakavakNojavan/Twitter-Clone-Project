import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiHome, FiUser, FiBookmark, FiBell } from "react-icons/fi";
import { COLORS } from "./constants";
import Logo from "./Logo";

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 300px;
  overflow-x: hidden;
  padding-top: 20px;
`;

const SidebarList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding-left: 20px;
`;

const SidebarListItem = styled.li`
  display: flex;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    color: #000;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 1em;
    font-size: 20px;
    font-family: sans-serif;

    .icon {
      margin-right: 10px;
    }

    &.active {
      color: ${COLORS.primary};
    }

    &:hover {
      background-color: #eee8fe;
      color: ${COLORS.primary};
    }
  }
`;

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <SidebarList>
        <Logo />
        <SidebarListItem>
          <Link to="/">
            <FiHome className="icon" />
            Home
          </Link>
        </SidebarListItem>
        <SidebarListItem>
          <Link to={`/treasurymog`}>
            <FiUser className="icon" />
            Profile
          </Link>
        </SidebarListItem>
        <SidebarListItem>
          <Link to="/notifications">
            <FiBell className="icon" />
            Notifications
          </Link>
        </SidebarListItem>
        <SidebarListItem>
          <Link to="/bookmarks">
            <FiBookmark className="icon" />
            Bookmarks
          </Link>
        </SidebarListItem>
      </SidebarList>
    </SidebarWrapper>
  );
};

export default Sidebar;
