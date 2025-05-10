import React from 'react';

export default function Page() {
    return (
      <form action="#" method="post">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />
  
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
  
        <button type="submit">Subscribe</button>
      </form>
    );
  }