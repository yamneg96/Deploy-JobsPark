import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const paymentOptions = [
  { name: "TeleBirr", logo: "/telebirr.jpg" },
  { name: "CBEBirr", logo: "/cbe.jpg" },
  { name: "AwashBirr", logo: "/AwashBirr.jpg" },
  { name: "Mpesa", logo: "/MPesa.jpg" },
  { name: "E-Birr", logo: "/Ebirr.jpg" },
  { name: "Amole", logo: "/Amole.jpg" },
  { name: "CooPayBirr", logo: "/Coop.jpg" },
  { name: "Enat Bank", logo: "/Enat.jpg" },
  { name: "Bank of Abyssinia", logo: "/Abyssinia.jpg" },
];

const PaymentPopUp = ({ closePopup }) => {

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
        <h2 className="text-center text-blue-600 text-lg font-medium mb-2">
          Your amount due is
        </h2>
        <h1 className="text-center text-4xl font-bold text-blue-700 mb-6">
          ETB 400
        </h1>

        <p className="text-center text-blue-600 text-lg font-medium mb-6">
          Choose your payment method
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {paymentOptions.map((method) => (
            <button
              key={method.name}
              className="bg-white border-2 border-blue-500 rounded-xl p-4 hover:shadow-md flex items-center justify-center transition cursor-pointer"
            >
              <img
                src={method.logo}
                alt={method.name}
                className="h-6 md:h-8"
              />
            </button>
          ))}
        </div>

        {/* Go Back Button */}
        <div className="flex justify-center">
          <Link
            to='/payment'
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl transition"
          >
            <ArrowLeft className="inline mr-2"/>
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopUp;