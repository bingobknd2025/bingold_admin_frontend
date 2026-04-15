const OtpInput = ({
  otp,
  setOtp,
  email,
  onVerify,
  onResend,
  onBack,
  isVerifying = false,
  isResending = false,
}) => {
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    document.getElementById(`otp-${focusIndex}`)?.focus();
  };

  return (
    <form onSubmit={onVerify} className="space-y-6">
      {/* Back Button */}
      {/* <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
      >
        Change email
      </button> */}

      {/* OTP Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Enter OTP
        </label>
        <div className="grid grid-cols-6 gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-full aspect-square text-center text-xl font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          ))}
        </div>
      </div>

      {/* Verify Button */}
      <button
        type="submit"
        disabled={isVerifying}
        className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </button>

      {/* Resend OTP */}
      <div className="text-center space-y-1">
        <p className="text-sm text-slate-500">Didn't receive the code?</p>
        <button
          type="button"
          onClick={onResend}
          disabled={isResending}
          className="text-sm text-primary hover:text-primary-dark font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </form>
  );
};

export default OtpInput;
