import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SuccessMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center bg-green-50 border border-green-200 rounded-2xl p-6 shadow-md max-w-md mx-auto mt-10"
    >
      <CheckCircle className="w-14 h-14 text-green-600 mb-3" />
      <h2 className="text-2xl font-semibold text-green-700 mb-1">
        Registration Successful!
      </h2>
      <p className="text-green-600 text-base">
        You have successfully registered with <span className="font-medium">Grace International</span>.
      </p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="mt-4"
      >
        <button
          className="px-5 py-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-sm"
          onClick={() => window.location.href = "/login"}
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}
