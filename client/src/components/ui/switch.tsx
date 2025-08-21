import { Switch as HSwitch } from "@headlessui/react";
import { useState } from "react";

type SwitchProps = {
  enabled?: boolean;
  defaultChecked?: boolean;
  onChange?: (val: boolean) => void;
};

export function Switch({ enabled, defaultChecked, onChange }: SwitchProps) {
  const [internalEnabled, setInternalEnabled] = useState(
    defaultChecked ?? false
  );

  const isControlled = enabled !== undefined;
  const value = isControlled ? enabled : internalEnabled;

  const handleChange = (val: boolean) => {
    if (!isControlled) setInternalEnabled(val);
    onChange?.(val);
  };

  return (
    <HSwitch
      checked={value}
      onChange={handleChange}
      className={`${
        value ? "bg-blue-600" : "bg-gray-300"
      } relative inline-flex h-6 w-11 items-center rounded-full transition`}
    >
      <span
        className={`${
          value ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </HSwitch>
  );
}
