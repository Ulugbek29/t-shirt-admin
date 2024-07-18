import { Widgets ,Payment } from "@mui/icons-material";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';


export const elements = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
  },
  {
    id: "products",
    title: "products",
    path: "/products",
    icon: RestaurantMenuIcon,
    // children: [
    //   {
    //     id: "createProduct",
    //     title: "Create Product",
    //     path: "/positions/create",
    //   },
    //   {
    //     id: "updateProduct",
    //     title: "Update Project",
    //     path: "/positions/update",
    //   },
    // ],
  },
  {
    id: "category",
    title: "category",
    path: "/category",
    icon: CategoryIcon,
  },
  // {
  //   id: "menu",
  //   title: "menu",
  //   path: "/menu",
  //   icon: RestaurantMenuIcon,
  //   // children: [
  //   //   {
  //   //     id: "childPage",
  //   //     title: "childPage",
  //   //     path: "/positions/create",
  //   //     icon: Widgets,
  //   //   },
  //   // ],
  // },
  {
    id: "orders",
    title: "orders",
    path: "/orders",
    icon: ShoppingCartIcon,
    // children: [
    //   {
    //     id: "childPage",
    //     title: "childPage",
    //     path: "/positions/create",
    //     icon: Widgets,
    //   },
    // ],
  },
  {
    id: "customer",
    title: "customer",
    path: "/customer",
    icon: GroupIcon,
    // children: [
    //   {
    //     id: "childPage",
    //     title: "childPage",
    //     path: "/positions/create",
    //     icon: Widgets,
    //   },
    // ],
  },
  
];
