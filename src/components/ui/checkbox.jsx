// checkbox.jsx
import React from "react";

export const Checkbox = ({ checked, onCheckedChange, ariaLabel }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      aria-label={ariaLabel}
    />
  );
};
