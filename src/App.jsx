import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/feedback";

function App() {
  const [form, setForm] = useState({
    studentName: "",
    subject: "",
    rating: "5",
    comments: "",
  });

  const [feedbackList, setFeedbackList] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadFeedback() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load feedback");
      setFeedbackList(await response.json());
    } catch {
      setMessage("Could not connect to the backend. Check that Spring Boot is running.");
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rating: Number(form.rating),
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      setMessage("Feedback submitted successfully!");
      setForm({
        studentName: "",
        subject: "",
        rating: "5",
        comments: "",
      });

      await loadFeedback();
    } catch {
      setMessage("Could not submit feedback. Check the backend connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <span className="eyebrow">STUDENT EXPERIENCE</span>
        <h1>Student Feedback</h1>
        <p>Your feedback helps us make learning better.</p>
      </header>

      <section className="panel">
        <h2>Share your feedback</h2>
        <p className="muted">Tell us about your learning experience.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="studentName">Student name</label>
          <input
            id="studentName"
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="e.g. Java"
            required
          />

          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            name="rating"
            value={form.rating}
            onChange={handleChange}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Needs improvement</option>
          </select>

          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={form.comments}
            onChange={handleChange}
            placeholder="Write your feedback..."
            rows="4"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit feedback"}
          </button>
        </form>

        {message && <p className="message" role="status">{message}</p>}
      </section>

      <section className="feedback-section">
        <h2>Submitted feedback</h2>
        <p className="muted">
          Feedback saved in your database appears here.
        </p>

        {feedbackList.length === 0 ? (
          <p className="empty">No feedback found yet.</p>
        ) : (
          <div className="feedback-list">
            {feedbackList.map((item) => (
              <article className="feedback-card" key={item.id}>
                <div className="card-heading">
                  <h3>{item.studentName}</h3>
                  <span className="rating">
                    {"★".repeat(item.rating || 0)}
                    {"☆".repeat(5 - (item.rating || 0))}
                  </span>
                </div>
                <p className="subject">{item.subject}</p>
                <p>{item.comments}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>Student Feedback Management System</footer>
    </main>
  );
}

export default App;
