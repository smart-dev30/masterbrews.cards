import { useState, useEffect } from 'react'

const useMaster = (name) => {
  const windowName = `__${name}`;
  const [value, setValue] = useState(null);

  useEffect(() => {
    setValue(window[name] || null);
  }, []);

  useEffect(() => {
    window[windowName] = value;
  }, [value]);

  return {value, setValue};
};

export default useMaster;