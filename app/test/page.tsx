"use client";
import { useState, useEffect } from "react";
import styles from "./Slider.module.css";

export default function Slider({ min, max, initialVal }) {
  const [val, setVal] = useState(initialVal || 50);

  useEffect(() => {
    document.documentElement.classList.add("js");
  }, []);

  const handleChange = (e) => {
    setVal(+e.target.value);
  };

  return (
    <input
      type="range"
      min={min || 0}
      max={max || 100}
      value={val}
      className={styles.range}
      onChange={handleChange}
      style={{
        "--min": min || 0,
        "--max": max || 100,
        "--val": val,
      }}
    />
  );
}
