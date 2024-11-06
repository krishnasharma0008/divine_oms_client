import {
  TOKEN,
  CONTACTNO,
  OTP,
  REDIRECTION_ROUTE,
  USER,
  ROLE,
  CUSTTYPE,
} from "./keys";

// Token management
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN, token);
};

// export const getToken = (): string | null => {
//   return localStorage.getItem(TOKEN); // Ensure you're using the correct key
// };
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    console.log("Checking localStorage for token with key:", TOKEN);
    return localStorage.getItem(TOKEN);
  }
  console.log("window is undefined, returning null");
  return null;
};
export const deleteToken = (): void => {
  localStorage.removeItem(TOKEN); // Use removeItem to completely delete the token
};

// Mobile number management
export const setMobileNumber = (contactno: string): void => {
  localStorage.setItem(CONTACTNO, contactno);
};

export const getMobileNumber = (): string | null => {
  return localStorage.getItem(CONTACTNO);
};

export const deleteMobileNumber = (): void => {
  localStorage.removeItem(CONTACTNO); // Use removeItem for consistency
};

// OTP management
export const setOTP = (otp: string): void => {
  localStorage.setItem(OTP, otp);
};

export const getOTP = (): string | null => {
  return localStorage.getItem(OTP);
};

export const deleteOTP = (): void => {
  localStorage.removeItem(OTP); // Use removeItem for consistency
};

// Redirection route management
export const setRedirectionRoute = (url: string): void => {
  localStorage.setItem(REDIRECTION_ROUTE, url);
};

export const getRedirectionRoute = (): string | null => {
  return localStorage.getItem(REDIRECTION_ROUTE);
};

export const deleteRedirectionRoute = (): void => {
  localStorage.removeItem(REDIRECTION_ROUTE); // Use removeItem for consistency
};

// User Name
export const setUser = (user: string): void => {
  localStorage.setItem(USER, user);
};

export const getUser = (): string | null => {
  return localStorage.getItem(USER); // Ensure you're using the correct key
};

export const deleteUser = (): void => {
  localStorage.removeItem(USER); // Use removeItem to completely delete the token
};

// User Role
export const setUserRole = (userrole: string): void => {
  localStorage.setItem(ROLE, userrole);
};

export const getUserRole = (): string | null => {
  return localStorage.getItem(ROLE); // Ensure you're using the correct key
};

export const deleteUserRole = (): void => {
  localStorage.removeItem(ROLE); // Use removeItem to completely delete the token
};

// Customer Type
export const setCustType = (custtype: string): void => {
  localStorage.setItem(CUSTTYPE, custtype);
};

export const getCustType = (): string | null => {
  return localStorage.getItem(CUSTTYPE);
};

export const deleteCustType = (): void => {
  localStorage.removeItem(CUSTTYPE); // Use removeItem for consistency
};
