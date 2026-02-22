"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [gbpRate, setGbpRate] = useState<number | null>(null);
  const [inrRate, setInrRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    try {
      const res = await axios.get("/api/rates");
      const rates = res.data.conversion_rates;

      setGbpRate(rates.GBP);
      setInrRate(rates.INR);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rates");
    }
  };

  useEffect(() => {
    fetchRates(); // Initial fetch

    const interval = setInterval(() => {
      fetchRates(); // Auto refresh every 60 seconds
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>USD Exchange Rates</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.card}>
          <div style={styles.rateRow}>
            <span>USD → Pound (£)</span>
            <span>{gbpRate}</span>
          </div>

          <div style={styles.rateRow}>
            <span>USD → INR (₹)</span>
            <span>{inrRate}</span>
          </div>

          <p style={styles.refresh}>Auto refreshes every 1 minute</p>
        </div>
      )}
    </main>
  );
}

const styles: any = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "32px",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "#111",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 0 20px rgba(255,255,255,0.1)",
  },
  rateRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    fontSize: "18px",
  },
  refresh: {
    fontSize: "12px",
    color: "#aaa",
    textAlign: "center",
    marginTop: "10px",
  },
};