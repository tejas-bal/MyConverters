"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [usd, setUsd] = useState<number>(1);
  const [gbpRate, setGbpRate] = useState<number | null>(null);
  const [inrRate, setInrRate] = useState<number | null>(null);
  const [eurRate, setEurRate] = useState<number | null>(null);
  const [bgImage, setBgImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch exchange rates
  const fetchRates = async () => {
    try {
      const res = await axios.get("/api/rates");
      const rates = res.data.conversion_rates;
      setGbpRate(rates.GBP);
      setInrRate(rates.INR);
      setEurRate(rates.EUR);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rates", error);
    }
  };

  // Fetch random background
  const fetchBackground = async () => {
    try {
      const res = await axios.get("/api/background");
      if (res.data.url) setBgImage(res.data.url);
    } catch (error) {
      console.error("Error fetching background", error);
    }
  };

  useEffect(() => {
    fetchRates();
    fetchBackground();

    const interval = setInterval(() => {
      fetchRates();
      fetchBackground();
    }, 60000); // refresh every 60s

    return () => clearInterval(interval);
  }, []);

  return (
    <main style={styles.container}>
      {/* Background */}
      <div style={{ ...styles.background, backgroundImage: `url(${bgImage})` }} />

      {/* Overlay with card */}
      <div style={styles.overlay}>
        <div style={styles.card}>

          {/* Input Row */}
          <div style={styles.inputRow}>
            <label style={styles.inputLabel}>
              <img src="/flags/us.png" alt="USD" style={styles.flag} /> $
              <input
                type="text"   // use text so we can format
                value={usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, ""); // remove commas
                  const num = parseFloat(value);
                  if (!isNaN(num)) setUsd(num);
                  else setUsd(0);
                }}
                style={styles.input}
              />
            </label>
          </div>

          {/* GBP Row */}
          <div style={styles.gridRow}>
            <div style={styles.flagCell}>
              <img src="/flags/gb.png" alt="GBP" style={styles.flag} />
            </div>
            <div style={styles.labelCell}>USD ($) → British Pound (£)</div>
            <div style={styles.valueCell}>
              {gbpRate !== null ? (usd * gbpRate).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' }) : "-"}
            </div>
          </div>

          {/* INR Row */}
          <div style={styles.gridRow}>
            <div style={styles.flagCell}>
              <img src="/flags/in.png" alt="INR" style={styles.flag} />
            </div>
            <div style={styles.labelCell}>USD ($) → Indian Rupee (₹)</div>
            <div style={styles.valueCell}>
              {inrRate !== null ? (usd * inrRate).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : "-"}
            </div>
          </div>
          {/* EUR Row */}
          <div style={styles.gridRow}>
            <div style={styles.flagCell}>
              <img src="/flags/eu.png" alt="EUR" style={styles.flag} />
            </div>
            <div style={styles.labelCell}>USD ($) → Euro (€)</div>
            <div style={styles.valueCell}>
              {eurRate !== null ? (usd * eurRate).toLocaleString('en-EU', { style: 'currency', currency: 'EUR' }) : "-"}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: any = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative"
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "grayscale(100%) brightness(70%) contrast(120%)",
    transition: "background-image 1s ease-in-out",
    zIndex: 1,
  },
  overlay: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: "10px",
  },
  card: {
    width: "75%",
    maxWidth: "600px",
    minWidth: "280px",
    backgroundColor: "rgba(17,17,17,0.85)",
    padding: "30px 20px",
    borderRadius: "16px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    fontSize: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "10px",
  },
  inputRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: "22px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  input: {
    fontSize: "20px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    width: "100px",
    minWidth: "80px",
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "40px 1fr auto", // last column auto width
    alignItems: "center",
    gap: "8px",
    overflow: "hidden", // prevent overflow
  },
  flagCell: { display: "flex", justifyContent: "center" },
  labelCell: { fontSize: "20px", fontWeight: 500 },
  valueCell: { fontSize: "20px", fontWeight: "bold", textAlign: "right" },
  flag: { width: "32px", height: "20px", objectFit: "cover", borderRadius: "4px" },
  refresh: { fontSize: "14px", color: "#ccc", textAlign: "center", marginTop: "10px" },
};