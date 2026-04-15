import { useRef } from "react";

export default function OTPInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const newVal = value.slice(0, i - 1 < 0 ? 0 : i);
      onChange(newVal);
      if (i > 0) refs[i - 1].current?.focus();
    } else if (/^\d$/.test(e.key)) {
      const newVal = value.slice(0, i) + e.key + value.slice(i + 1);
      onChange(newVal.slice(0, 6));
      if (i < 5) refs[i + 1].current?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center my-6">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onKeyDown={(e) => handleKey(i, e)}
          onChange={() => {}}
          onClick={() => refs[i].current?.select()}
          className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all duration-200"
          style={{
            borderColor: value[i] ? "#2563eb" : "#e2e8f0",
            background: value[i] ? "#eff6ff" : "#f8fafc",
            color: "#1e293b",
          }}
        />
      ))}
    </div>
  );
}
