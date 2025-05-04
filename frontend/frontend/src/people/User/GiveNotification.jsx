import React, { useState } from "react";

const SubmitFeedback = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, rating }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Feedback submitted!");
        setMessage("");
        setRating(0);
      });
  };

  return (
    <div className="container mt-5">
      <h4 className="fw-bold mb-4">Submit Feedback</h4>

      <form onSubmit={handleSubmit}>
        {/* Rating input */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Rate your experience (1-5):</label>
          <select
            className="form-select"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            <option value="">-- Select Rating --</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Feedback textarea */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Your Feedback</label>
          <textarea
            className="form-control"
            rows="5"
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-lg btn-block btn-light lift text-uppercase">Send</button>
      </form>
    </div>
  );
};

export default SubmitFeedback;
