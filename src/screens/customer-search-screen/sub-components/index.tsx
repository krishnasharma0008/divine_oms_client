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
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!customerid || customerid === "new") {
        setEditMode(true);
        return;
      }

      //showLoader();
      try {
        const res = await getCustomerDetailID(parseInt(`${customerid}`, 10));
        dispatch({
          type: "ALL",
          payload: { ...(res.data.data as unknown as CustomerDetail) },
        });
        setEditMode(false);
      } catch (err) {
        console.error("Error fetching customer details:", err);
        notifyErr(err as string);
      } finally {
        //hideLoader();
      }
    };

    fetchCustomerDetails();
  }, [customerid, notifyErr]); // hideLoader, showLoader,

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

    // if (!state.address) {
    //   validationErrors.address = "Address is required";
    // }

    if (!state.contactno) {
      validationErrors.contactno = "Mobile number is required";
    }

    // if (!state.pan) {
    //   validationErrors.pan = "Pan no is required";
    // }

    // if (!state.gender) {
    //   validationErrors.gender = "Gender is required";
    // }

    // if (!state.dob) {
    //   validationErrors.dob = "Date of Birth is required";
    // }

    // if (!state.pincode) {
    //   validationErrors.pincode = "Pin code is required";
    // }

    // if (!state.email) {
    //   validationErrors.email = "Email is ";
    // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(state.email)) {
    //   validationErrors.phemail = "Invalid email";
    // }

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
      //setCustomer(payload);
      // Update payload with the ID from the response
      console.log("Customer id : ", res.data.id);
      payload.id = res.data.id;
      // Update state with the updated payload
      console.log(payload);
      setCustomer(payload);
      onCustomerAdded(); // Move this inside the success block
      router.push("/choose-your-order");
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
    //console.log(payload);
    setCustomer(payload); // Save customer data to zustand store
    onCustomerAdded();
    router.push("/choose-your-order");
    //setEditMode(true);
  };

  return (
    <div className="w-full">
      {customerid === "new" ? (
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
          New customer details
        </h2>
      ) : (
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
          Customer profile
        </h2>
      )}
      <p className="mt-1 text-sm text-gray-500">
        {editMode
          ? "Fill in the required fields to continue."
          : "Review details and apply to proceed."}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
        <InputText
          containerClass="w-full"
          label="Name"
          name="Name"
          onChange={onChangeHandlerCreator("name")}
          placeholder="Name"
          type="text"
          value={state.name}
          disabled={!editMode}
          className={`w-full ${errors.name ? "border-red-500" : ""}`}
          errorText={errors.name}
        />
        <InputText
          containerClass="w-full"
          label="Address"
          name="address"
          onChange={onChangeHandlerCreator("address")}
          placeholder="Address"
          type="text"
          value={state.address}
          disabled={!editMode}
          className={`w-full ${errors.address ? "border-red-500" : ""}`}
          errorText={errors.address}
        />
        <InputText
          containerClass="w-full"
          label="Mobile"
          name="mobile"
          onChange={onChangeHandlerCreator("contactno")}
          placeholder="Contact No"
          type="number"
          value={state.contactno}
          disabled={!editMode}
          className={`w-full ${errors.contactno ? "border-red-500" : ""}`}
          errorText={errors.contactno}
        />
        <InputText
          containerClass="w-full"
          label="Pan Card"
          name="pan"
          onChange={onChangeHandlerCreator("pan")}
          placeholder="Pan No"
          type="text"
          value={state.pan}
          disabled={!editMode}
          className={`w-full ${errors.pan ? "border-red-500" : ""}`}
          errorText={errors.pan}
        />

        <div className="mb-4 sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Gender
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(CUSTOMER_GENDER).map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => changeGender(gender)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  state.gender === gender
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } ${errors.gender ? "ring-2 ring-red-500" : ""}`}
                disabled={!editMode}
              >
                {gender}
              </button>
            ))}
          </div>
          {errors.gender && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.gender}
            </span>
          )}
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
          className={`w-full ${errors.dob ? "border-red-500" : ""}`}
          errorText={errors.dob}
        />
        <InputText
          label="Pin Code"
          name="pincode"
          onChange={onChangeHandlerCreator("pincode")}
          placeholder="Pin Code"
          type="text"
          value={state.pincode}
          disabled={!editMode}
          containerClass="w-full"
          className={`w-full ${errors.pincode ? "border-red-500" : ""}`}
          errorText={errors.pincode}
        />
        <InputText
          containerClass="w-full sm:col-span-2"
          label="Email"
          name="email"
          onChange={onChangeHandlerCreator("email")}
          placeholder="Email"
          type="text"
          value={state.email}
          disabled={!editMode}
          className={`w-full ${errors.email ? "border-red-500" : ""}`}
          errorText={errors.email}
        />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCloseHandler}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 sm:w-auto"
        >
          Close
        </button>
        <button
          type="button"
          onClick={editMode ? onSubmitHandler : onEditClickHandler}
          className="w-full rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
        >
          {editMode ? "Submit details" : "Apply & continue"}
        </button>
      </div>
    </div>
  );
};

export default CustomerCreateScreen;
