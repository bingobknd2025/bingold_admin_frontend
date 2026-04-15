const SectionCard = ({ icon: Icon, title, badge, children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="border-b border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center min-w-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 shrink-0" />
          <h2 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
            {title}
          </h2>
        </div>
        {badge}
      </div>
    </div>
    <div className="px-4 sm:px-6 pb-3">{children}</div>
  </div>
);

export default SectionCard;
