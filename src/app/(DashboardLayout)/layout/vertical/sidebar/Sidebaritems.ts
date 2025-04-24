export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    heading: "HOME",
    children: [
      {
        name: "Dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/",
      },
    ],
  },
  {
    heading: "GALLERY",
    children: [
      {
        name: "My Gallery",
        icon: "solar:gallery-linear",
        id: uniqueId(),
        url: "/gallery",
      },
      {
        name: "My Tasks",
        icon: "solar:checklist-linear",
        id: uniqueId(),
        url: "/tasks",
      },
      {
        name: "My Wallets",
        icon: "solar:wallet-outline",
        id: uniqueId(),
        url: "/wallets",
      },
      {
        name: "Notifications",
        icon: "solar:bell-outline",
        id: uniqueId(),
        url: "/notifications",
      },
    ],
  },
  {
    heading: "UTILITIES",
    children: [
      {
        name: "Typography",
        icon: "solar:text-circle-outline",
        id: uniqueId(),
        url: "/ui/typography",
      },
      {
        name: "Table",
        icon: "solar:bedside-table-3-linear",
        id: uniqueId(),
        url: "/ui/table",
      },
      {
        name: "Form",
        icon: "solar:password-minimalistic-outline",
        id: uniqueId(),
        url: "/ui/form",
      },
      {
        name: "Shadow",
        icon: "solar:airbuds-case-charge-outline",
        id: uniqueId(),
        url: "/ui/shadow",
      },
    ],
  },
  {
    heading: "AUTH",
    children: [
      {
        name: "Sign In",
        icon: "solar:login-2-linear",
        id: uniqueId(),
        url: "/auth/signin",
      },
      {
        name: "Sign Up",
        icon: "solar:shield-user-outline",
        id: uniqueId(),
        url: "/auth/signup",
      },
      {
        name: "Logout",
        icon: "solar:logout-outline",
        id: uniqueId(),
        url: "/auth/signout",
      },
    ],
  },
  {
    heading: "EXTRA",
    children: [
      {
        name: "Icons",
        icon: "solar:smile-circle-outline",
        id: uniqueId(),
        url: "/icons/solar",
      },
      {
        name: "Sample Page",
        icon: "solar:notes-minimalistic-outline",
        id: uniqueId(),
        url: "/sample-page",
      },
    ],
  },
];

export default SidebarContent;
