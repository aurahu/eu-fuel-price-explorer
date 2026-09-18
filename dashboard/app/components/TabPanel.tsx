"use client";

import { useState } from "react";

type Tab = {
  label: string;
  color: string;
  content: React.ReactNode;
};

type TabPanelProps = {
  tabs: Tab[];
};

export default function TabPanel({ tabs }: TabPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  const active = tabs[activeTab];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex items-end justify-center gap-1">
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`relative px-6 py-4 text-lg font-medium rounded-t-3xl focus:rounded-t-3xl transition-colors ${
                isActive
                  ? "rounded-t-3xl"
                  : "bg-transparent text-background"
              }`}
              style={{
                backgroundColor: isActive ? tab.color : "transparent",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div
        className="min-h-64"
        style={{
          backgroundColor: active.color,
        }}
      >
        {active.content}
      </div>
    </div>
  );
}