const InfoRow = ({
  label,
  value,
  icon: Icon,
  labelWidth = "sm:w-48",
  iconSize = "w-3.5 h-3.5",
  textSize = "text-xs sm:text-sm",
  fallback = "N/A",
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-gray-100 last:border-0 gap-1 sm:gap-0">
      <div className={`flex items-center ${labelWidth} shrink-0`}>
        {Icon && <Icon className={`${iconSize} text-gray-400 mr-2 shrink-0`} />}
        <span className={`${textSize} text-gray-500`}>{label}</span>
      </div>

      <span
        className={`${textSize} font-medium text-gray-900 sm:ml-2 break-all`}
      >
        {value ?? <span className="text-gray-400 italic">{fallback}</span>}
      </span>
    </div>
  );
};

export default InfoRow;
