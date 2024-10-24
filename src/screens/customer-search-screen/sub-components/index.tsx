"use client";

import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { CustomerDetail } from "@/interface";
import NotificationContext from "@/context/notification-context";
import LoaderContext from "@/context/loader-context";
import { InputText } from "@/components";
import { CUSTOMER_GENDER } from "@/enums";
import DatePicker from "@/components/common/date-picker";
import { CalendarIcon } from "@/components/icons";
import { getCustomerDetailID, createCustomer } from "@/api/customer";
import { useCustomerStore } from "@/store/customerStore";

dayjs.extend(utcPlugin);

interface CustomerDetailProps {
  customerid: string | null; // Accept id as a prop (nullable in case it's not available)
  onCustomerAdded: () => void;
}

interface CustomerDetaillAction {
  type: string;
  payload?: string | boolean | CustomerDetail;
}

const initialState: CustomerDetail = {
  id: 0,
  name: "",
  address: "",
  contactno: "",
  pan: "",
  gender: "",
  dob: "",
  pincode: "",
  email: "",
};

const CustomerDetailReducer = (
  state: CustomerDetail,
  action: CustomerDetaillAction
) => {
  if (action.type === "ALL") {
    return {
      ...state,
      ...(action.payload as unknown as CustomerDetail),
    };
  }
  return { ...state, [action.type]: action.payload };
};

const CustomerCreateScreen: React.FC<CustomerDetailProps> = ({
  customerid,
  onCustomerAdded,
}) => {
  const { setCustomer } = useCustomerStore(); // Use the customer store
  const [state, dispatch] = useReducer(CustomerDetailReducer, initialState);
  const [editMode, setEditMode] = useState<boolean>(customerid === "new");
  const { notify, notifyErr } = useContext(NotificationContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!customerid || customerid === "new") {
        setEditMode(true);
        return;
      }

      showLoader();
      try {
        const res = await getCustomerDetailID(parseInt(`${customerid}`, 10));
        dispatch({
          type: "ALL",
          payload: { ...(res.data.data as unknown as CustomerDetail) },
        });
      } catch (err) {
        console.error("Error fetching customer details:", err);
        notifyErr(err as string);
      } finally {
        hideLoader();
      }
    };

    fetchCustomerDetails();
  }, [customerid, hideLoader, showLoader, notifyErr]);

  const onChangeHandlerCreator = (fieldname: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({
        type: fieldname,
        payload: (e.target as HTMLInputElement).value,
      });
  };

  const changeGender = (gender: string) => {
    dispatch({
      type: "gender",
      payload: gender,
    });
  };

  const DateFormat = "YYYY-MM-DD HH:mm:ss";

  const onDateChangeHandler = (fieldname: string) => (date: Date | null) => {
    dispatch({
      type: fieldname,
      payload: date?.toISOString(),
    });
  };

  const onSubmitHandler = async () => {
    const validationErrors: { [key: string]: string } = {};

    if (!state.name) {
      validationErrors.name = "Name is required";
    }

    if (!state.address) {
      validationErrors.address = "Address is required";
    }

    if (!state.contactno) {
      validationErrors.contactno = "Mobile number is required";
    }

    if (!state.pan) {
      validationErrors.pan = "Pan no is required";
    }

    if (!state.gender) {
      validationErrors.gender = "Gender is required";
    }

    if (!state.dob) {
      validationErrors.dob = "Date of Birth is required";
    }

    if (!state.pincode) {
      validationErrors.pincode = "Pin code is required";
    }

    if (!state.email) {
      validationErrors.email = "Email is ";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(state.email)) {
      validationErrors.phemail = "Invalid email";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: CustomerDetail = {
      name: state.name,
      address: state.address,
      contactno: state.contactno,
      pan: state.pan,
      gender: state.gender,
      dob: new Date(state.dob || Date.now()).toISOString(),
      pincode: state.pincode,
      email: state.email,
    };

    if (customerid && customerid !== "new") {
      payload.id = parseInt(`${customerid}`, 10);
    }
    //console.log(payload);
    showLoader();
    try {
      const res = await createCustomer(payload); // Await the response
      console.log("Customer created successfully", res);
      notify("Customer created successfully");
      onCustomerAdded(); // Move this inside the success block
    } catch (err) {
      console.log("Error creating customer", err);
      notifyErr(err as string);
    } finally {
      hideLoader(); // Ensure the loader is hidden in any case
    }
  };

  const onCloseHandler = () => {
    onCustomerAdded();
    // Show loader and perform the submit action here
  };

  const onEditClickHandler = () => {
    console.log("Apply Details");

    const payload: CustomerDetail = { ...state };
    console.log(payload);
    setCustomer(payload); // Save customer data to zustand store
    onCustomerAdded();
    //setEditMode(true);
  };

  return (
    <div className="flex-1 w-full  bg-gray-50 px-4 rounded-lg">
      {customerid === "new" && (
        <div>
          <h1 className="py-2 font-extralight text-2xl leading-[18px]">
            Please Fill Customer Details
          </h1>
        </div>
      )}

      <div className="flex-row pt-5">
        <div className="flex justify-between">
          <InputText
            containerClass="w-96"
            label="Name"
            name="Name"
            onChange={onChangeHandlerCreator("name")}
            placeholder="Name"
            type="text"
            value={state.name}
            disabled={!editMode}
            className={`w-96 ${errors.name ? "" : "border-red-500"}`}
            errorText={errors.name}
          />
          <InputText
            containerClass="w-96"
            label="Address"
            name="address"
            onChange={onChangeHandlerCreator("address")}
            placeholder="Address"
            type="text"
            value={state.address}
            disabled={!editMode}
            className={`w-96 ${errors.address ? "" : "border-red-500"}`}
            errorText={errors.address}
          />
        </div>
      </div>
      <div className="flex-row pt-1">
        <div className="flex justify-between">
          <InputText
            containerClass="w-96"
            label="Mobile"
            name="mobile"
            onChange={onChangeHandlerCreator("contactno")}
            placeholder="Contact No"
            type="number"
            value={state.contactno}
            disabled={!editMode}
            className={`w-96 ${errors.contactno ? "" : "border-red-500"}`}
            errorText={errors.contactno}
          />
          <InputText
            containerClass="w-96"
            label="Pan Card"
            name="pan"
            onChange={onChangeHandlerCreator("pan")}
            placeholder="Pan No"
            type="text"
            value={state.pan}
            disabled={!editMode}
            className={`w-96 ${errors.pan ? "" : "border-red-500"}`}
            errorText={errors.pan}
          />
        </div>
      </div>
      <div className="flex-row pt-1">
        <div className="flex justify-between">
          <div className="flex flex-col w-96">
            <label className="mb-2">Gender</label>
            <div className="flex gap-2 justify-around">
              {Object.values(CUSTOMER_GENDER).map((gender) => (
                <button
                  key={gender}
                  onClick={() => changeGender(gender)}
                  className={`py-2 px-4 rounded-md ${
                    state.gender === gender
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } ${errors.gender ? "border border-red-500" : ""}`}
                  disabled={!editMode}
                >
                  {gender}
                </button>
              ))}
            </div>
            {errors.gender && (
              <span className="text-red-500 text-xs mt-1">{errors.gender}</span>
            )}{" "}
            {/* Display error text */}
          </div>
          <DatePicker
            onChange={onDateChangeHandler("dob")}
            label="DOB"
            value={
              state.dob
                ? new Date(dayjs.utc(state.dob).format(DateFormat))
                : null
            }
            showIcon={editMode}
            icon={CalendarIcon}
            className={`w-96 ${errors.dob ? "border-red-500" : ""}`}
            errorText={errors.dob}
          />
        </div>
      </div>
      <div className="flex-row pt-1">
        <div className="flex justify-between">
          <InputText
            label="Pin Code"
            name="pincode"
            onChange={onChangeHandlerCreator("pincode")}
            placeholder="Pin Code"
            type="text"
            value={state.pincode}
            disabled={!editMode}
            containerClass="w-96"
            className={`w-96 ${errors.pincode ? "" : "border-red-500"}`}
            errorText={errors.pincode}
          />
          <InputText
            containerClass="w-96"
            label="Email"
            name="email"
            onChange={onChangeHandlerCreator("email")}
            placeholder="Email"
            type="text"
            value={state.email}
            disabled={!editMode}
            className={`w-96 ${errors.email ? "" : "border-red-500"}`}
            errorText={errors.email}
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-center gap-x-6 my-5 py-5">
          <button
            type="button"
            onClick={onCloseHandler}
            className="inline-flex items-center justify-center px-4 py-2 bg-black border border-transparent rounded-md font-semibold capitalize text-white hover:bg-Chinese-Black-sidebar active:bg-Chinese-Black-sidebar focus:outline-none focus:bg-Chinese-Black-sidebar focus:ring focus:ring-red-200 disabled:opacity-25 transition"
          >
            Close
          </button>
          {customerid === "new" ? (
            <button
              type="button"
              onClick={onSubmitHandler}
              className="w-72 rounded-md bg-black py-2 text-sm font-semibold text-white shadow-sm hover:bg-Chinese-Black-sidebar focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 px-12"
            >
              Submit Details
            </button>
          ) : (
            <button
              type="button"
              onClick={onEditClickHandler}
              className="w-72 rounded-md bg-black py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 px-12"
            >
              {/* Edit */}Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCreateScreen;
