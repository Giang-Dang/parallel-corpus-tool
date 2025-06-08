import { TABS } from '@/constants/tabs';
import { useAppContext } from '@/contexts/AppContext';
import useRibbonMenuAction from './hooks/useRibbonMenuAction';
import FileMenu from './FileMenu';
import { useCallback } from 'react';

export default function RibbonMenu() {
  const { activeTab, setActiveTab } = useAppContext();
  const { isCollapsed, toggleCollapse } = useRibbonMenuAction();

  const renderTabContent = useCallback((activeTab: string) => {
    switch (activeTab) {
      case 'file':
        return <FileMenu />;
      case 'search':
        return <div>Search</div>;
      case 'statistics':
        return <div>Statistics</div>;
      case 'help':
        return <div>Help</div>;
      default:
        return null;
    }
  }, []);

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      {/* Tab Headers */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
            }}
            className={`relative min-w-0 flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 sm:px-8 ${
              activeTab === tab.id
                ? 'border-b-3 border-blue-500 bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:bg-white/200 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && !isCollapsed && (
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isCollapsed ? 'max-h-0' : 'max-h-[600px]'
        }`}
      >
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? 'scale-98 opacity-80' : 'scale-100 opacity-100'
          }`}
        >
          <div className="min-h-[100px] bg-gradient-to-r from-gray-50/30 to-white p-3 sm:p-6">
            {renderTabContent(activeTab)}
          </div>
        </div>
      </div>

      {/* Bottom Collapse Toggle Bar */}
      <button
        onClick={toggleCollapse}
        className={`group relative h-8 w-full border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50/70 transition-all duration-300 ease-out hover:from-gray-100 hover:to-gray-100/80`}
        aria-label={isCollapsed ? 'Expand ribbon menu' : 'Collapse ribbon menu'}
        title={`${isCollapsed ? 'Expand' : 'Collapse'} ribbon (Ctrl+F1)`}
      >
        {/* Center Icon Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`flex items-center space-x-2 transition-all duration-200 ${
              isCollapsed ? 'scale-100 opacity-100' : 'scale-100 opacity-80 group-hover:opacity-100'
            }`}
          >
            {/* Icon */}
            <svg
              className={`h-4 w-4 text-blue-600 transition-all duration-300`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d={isCollapsed ? 'M5 9l7 7 7-7' : 'M19 15l-7-7-7 7'}
              />
            </svg>

            {/* Text labels for both states */}
            <span
              className={`hidden text-xs font-medium text-blue-700 transition-all duration-200 sm:block`}
            >
              {isCollapsed ? 'Click to expand' : 'Click to collapse'}
            </span>
          </div>
        </div>

        {/* Hover indicator line */}
        <div
          className={`absolute top-0 left-1/2 h-0.5 w-24 -translate-x-1/2 transform bg-blue-500 opacity-0 transition-all duration-200 group-hover:opacity-60`}
        />
      </button>
    </div>
  );
}
