import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-14 h-7 bg-slate-600 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
    </label>
  );
};

export default ToggleSwitch;
