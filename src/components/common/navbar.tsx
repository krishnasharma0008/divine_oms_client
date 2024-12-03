import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
//import { useCart } from "@/context/cart-context";
//import { useEffect, useState } from "react";

import Breadcrumb from "./breadcrumb";
//import { deleteToken, getToken } from "@/local-storage";
//import { getUser, getUserRole } from "@/local-storage";
import { UserIcon } from "../icons";
import LoginContext from "@/context/login-context";
import ShoppingCartIcon from "../icons/shopping-cart-icon";
// import { CartDetail } from "@/interface";
// import { getCartDetailList } from "@/api/cart";
// import { getUser } from "@/local-storage";
//import LoaderContext from "@/context/loader-context";

const Navbar: React.FC = () => {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toggleLogin, isCartCount } = useContext(LoginContext);
  //const [cartData, setCartData] = useState<CartDetail[]>([]);
  //const { showLoader, hideLoader } = useContext(LoaderContext);
  //const { cartData } = useCart();

  const { push } = useRouter();

  const logout = () => {
    // deleteToken();
    // //setIsLoggedIn(false);
    // push("/");
    // // Force a page refresh
    // window.location.reload();
    toggleLogin();
    push("/");
    window.location.reload();
  };

  const ViewCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      console.log("Navigating to cart");
      push("/jewellery-cart");
    } catch (error) {
      console.error("Error navigating to cart:", error);
    }
  };

  const OrderList = () => {
    //deleteToken();
    push("/order-list");
  };

  // useEffect(() => {
  //   const fetchCartData = async () => {
  //     showLoader();
  //     try {
  //       const res = await getCartDetailList(getUser() ?? "");
  //       setCartData(res.data.data); // Initialize directly from API
  //       console.log(res.data.data);
  //       //setcartData(cartData);
  //     } catch (error) {
  //       console.error("Error fetching cart details:", error);
  //     } finally {
  //       hideLoader();
  //     }
  //   };

  //   fetchCartData();
  // }, [showLoader, hideLoader]);

  // useEffect(() => {
  //   if (getToken()) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  return (
    <header className="relative flex flex-col items-center bg-white px-4 py-2 shadow sm:flex-row md:h-20">
      <div className="flex w-full flex-col justify-between overflow-hidden transition-all sm:max-h-full sm:flex-row sm:items-center">
        <div>
          <Breadcrumb />
        </div>
        <div>
          <Link href="/">
            <div className="flex flex-row justify-center items-center">
              <Image
                src="/logo/old_logo.png"
                alt="Company Logo"
                width={869}
                height={567}
                className="h-auto w-auto max-h-[71px] max-w-[164px] lg:max-h-[74px] lg:max-w-[184px] cursor-pointer py-1"
                layout="intrinsic"
              />
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4 w-32">
          <ul className="mx-auto mt-4 flex space-x-6 sm:mx-0 sm:mt-0">
            <li className="">
              {/* {isLoggedIn ? ( 
              // User is logged in, show dropdown menu*/}
              <Menu>
                <MenuHandler>
                  <IconButton
                    variant="text"
                    className="mr-2 relative cursor-pointer"
                  >
                    {/* Welcome{getUser()} */}
                    <UserIcon />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem
                    className="flex items-center gap-2"
                    onClick={OrderList}
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <g strokeLinecap="round" strokeWidth="2">
                        <path d="M8.5 14.5h7.657" />
                        <path d="M8.5 10.5h7.657" />
                        <path d="M8.5 6.5h7.657" />
                        <path d="M5.5 14.5h0" />
                        <path d="M5.5 10.5h0" />
                        <path d="M5.5 6.5h0" />
                      </g>
                      <path
                        d="M9.128 20.197H3.444a2.22 2.22 0 01-2.229-2.153V3.152A2.153 2.153 0 013.367.997h15.48A2.153 2.153 0 0121 3.152v8.738"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                      <path
                        fill="currentColor"
                        d="M16.5 23.499a1.464 1.464 0 01-1.094-.484l-2.963-2.969A1.479 1.479 0 0112 18.985a1.5 1.5 0 01.462-1.078 1.56 1.56 0 012.113.037l1.925 1.931 4.943-4.959a1.543 1.543 0 012.132.02 1.461 1.461 0 01.425 1.04 1.5 1.5 0 01-.45 1.068l-5.993 6.012a1.44 1.44 0 01-1.057.443z"
                      />
                    </svg>

                    <Typography variant="small" className="font-medium">
                      My Order
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    className="flex items-center gap-2 "
                    onClick={logout}
                  >
                    <svg
                      width="16"
                      height="14"
                      viewBox="0 0 16 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                        fill="#90A4AE"
                      />
                    </svg>
                    <Typography variant="small" className="font-medium">
                      Sign Out
                    </Typography>
                  </MenuItem>
                </MenuList>
              </Menu>
            </li>
          </ul>

          <div className="relative cursor-pointer" onClick={ViewCart}>
            <ShoppingCartIcon />
            {isCartCount > 0 && (
              <span className="absolute top-0 left-4 flex items-center justify-center text-xs font-light text-white bg-green-500 rounded-full w-4 h-4">
                {isCartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
