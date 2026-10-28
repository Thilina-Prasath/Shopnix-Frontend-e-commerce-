import { useState, useEffect } from "react";
import { BsCashCoin, BsCreditCard, BsCheckCircle } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

export default function CheckoutPopup({
  isOpen,
  onClose,
  totalAmount,
  onConfirmPayment,
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [amountGiven, setAmountGiven] = useState("");

  const [balance, setBalance] = useState(0);

  if (!isOpen) return null;

  useEffect(() => {
    const given = parseFloat(amountGiven) || 0;
    if (paymentMethod === "cash") {
      setBalance(given > totalAmount ? given - totalAmount : 0);
    } else {
      setBalance(0);
    }
  }, [amountGiven, totalAmount, paymentMethod]);

  const quickAmounts = [
    Math.ceil(totalAmount / 100) * 100,
    500,
    1000,
    5000,
  ].filter(
    (amt, index, self) => amt >= totalAmount && self.indexOf(amt) === index,
  );

  const handleConfirm = () => {
    const given = parseFloat(amountGiven) || 0;

    if (paymentMethod === "cash" && given < totalAmount) {
      alert("Amount given is less than the total amount!");
      return;
    }

    const paymentDetails = {
      method: paymentMethod,
      amountGiven: paymentMethod === "cash" ? given : totalAmount,
      balance: balance,
    };

    onConfirmPayment(paymentDetails);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto overflow-hidden animate-fadeInUp">
        {/* Header */}
        <div className="bg-blue-600 p-4 sm:p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition-colors"
          >
            <AiOutlineClose className="text-lg sm:text-xl" />
          </button>
          <p className="text-blue-100 font-medium mb-1 text-sm sm:text-base">
            Total to Pay
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Rs. {totalAmount.toFixed(2)}
          </h2>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          {/* Payment Method Selector */}
          <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`flex-1 py-3 sm:py-4 rounded-xl border-2 flex flex-col items-center gap-1.5 sm:gap-2 transition-all ${
                paymentMethod === "cash"
                  ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                  : "border-gray-200 text-gray-500 hover:border-blue-300"
              }`}
            >
              <BsCashCoin className="text-2xl sm:text-3xl" />
              <span className="text-sm sm:text-base">Cash</span>
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 py-3 sm:py-4 rounded-xl border-2 flex flex-col items-center gap-1.5 sm:gap-2 transition-all ${
                paymentMethod === "card"
                  ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                  : "border-gray-200 text-gray-500 hover:border-blue-300"
              }`}
            >
              <BsCreditCard className="text-2xl sm:text-3xl" />
              <span className="text-sm sm:text-base">Card POS</span>
            </button>
          </div>

          {/* Cash Payment Section */}
          {paymentMethod === "cash" && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Amount Given (Rs.)
                </label>
                <input
                  type="number"
                  value={amountGiven}
                  onChange={(e) => setAmountGiven(e.target.value)}
                  placeholder="Enter received amount"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 text-xl sm:text-2xl text-center font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0 outline-none"
                  autoFocus
                />
              </div>

              {/* Quick Amounts */}
              <div className="flex gap-2 justify-center flex-wrap">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmountGiven(amt.toString())}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm sm:text-base transition-colors"
                  >
                    Rs. {amt}
                  </button>
                ))}
              </div>

              <div
                className={`p-3 sm:p-4 rounded-xl flex justify-between items-center ${balance > 0 ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
              >
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  Balance to Return:
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold ${balance > 0 ? "text-green-600" : "text-gray-900"}`}
                >
                  Rs. {balance.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Card Payment Section */}
          {paymentMethod === "card" && (
            <div className="p-5 sm:p-8 text-center animate-fadeIn bg-gray-50 rounded-xl border border-gray-200">
              <BsCreditCard className="text-4xl sm:text-5xl text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                Please swipe/insert card on the POS machine.
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Confirm below once the transaction is successful.
              </p>
            </div>
          )}
        </div>

        {/* Footer (Action Buttons) */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleConfirm}
            className="w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <BsCheckCircle /> Complete Payment
          </button>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
