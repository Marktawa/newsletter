"use client";

import React from "react";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const token = process.env.STRAPI_API_TOKEN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        if (data.errors) {
          // Display validation error
          setMessage(data.errors.map(err => `${err.field}: ${err.message}`).join(', '));
        } else {
          throw new Error("Failed to subscribe");
        }
      } else {
        setMessage("Subscription successful!");
        setName("");
        setEmail("");
      }
    } catch (error) {
      setMessage("Subscription failed. Try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Subscribe</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}