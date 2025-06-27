import React from 'react';

interface SidebarLinkProps {
  href: string;
  label: string;
  pathname: string;
}

declare const Sidebar: React.FC;
declare const SidebarLink: React.FC<SidebarLinkProps>;

export { Sidebar, SidebarLink };