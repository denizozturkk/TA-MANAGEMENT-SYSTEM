import React, { useEffect, useState } from "react";

const mockData = [
  {
    _id: "1",
    rating: 5,
    message: "Excellent interface! Very intuitive and clean.",
    createdAt: "2025-05-02T13:45:00.000Z"
  },
  {
    _id: "2",
    rating: 4,
    message: "Overall good, but some pages load slowly.",
    createdAt: "2025-05-03T10:12:00.000Z"
  },
  {
    _id: "3",
    rating: 3,
    message: "Some features are hard to find. Improve navigation.",
    createdAt: "2025-05-03T14:22:00.000Z"
  },
  {
    _id: "4",
    rating: 2,
    message: "The profile update feature is buggy.",
    createdAt: "2025-05-01T09:31:00.000Z"
  },
  {
    _id: "5",
    rating: 1,
    message: "App crashes on mobile view!",
    createdAt: "2025-04-30T20:10:00.000Z"
  }
];

const ViewFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setFeedbackList(mockData);
      setLoading(false);
    }, 1000); // delay to mimic API call
  }, []);

  if (loading) {
    return <div className="container mt-5">Loading feedback...</div>;
  }

  return (
    <div className="container mt-5">
      <h4 className="fw-bold mb-4">All Submitted Feedback</h4>
      {feedbackList.length === 0 ? (
        <div className="alert alert-warning">No feedback found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className={`badge bg-${item.rating >= 4 ? 'success' : item.rating === 3 ? 'warning' : 'danger'}`}>
                      {item.rating} / 5
                    </span>
                  </td>
                  <td>{item.message}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
