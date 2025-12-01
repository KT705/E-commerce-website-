import { useState } from "react";
import emailjs from "emailjs-com";
import Footer from "./Footer";

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const sendMessage = (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    emailjs
      .sendForm(
        "service_hd50ao1", 
        "template_6jtyn1e",
        form, 
        "vwxjl_e4BfqjQhRqN" 
      )
      .then(() => {
        setSuccess(true);
        setLoading(false);
        form.reset();
      })
      .catch(() => {
        setSuccess(false);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 md:px-20 py-20 text-white">
        <div className="w-full max-w-2xl bg-zinc-900 p-10 rounded-2xl shadow-xl space-y-6">
          <h1 className="text-3xl font-bold text-center">Contact Us</h1>
          <p className="text-center text-zinc-400">Send us a message and we'll reply as soon as possible.</p>

          <form onSubmit={sendMessage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                className="w-full p-3 rounded-xl bg-zinc-800 focus:outline-none focus:ring focus:ring-zinc-600"
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                className="w-full p-3 rounded-xl bg-zinc-800 focus:outline-none focus:ring focus:ring-zinc-600"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className="w-full p-3 rounded-xl bg-zinc-800 focus:outline-none focus:ring focus:ring-zinc-600"
            />

            <textarea
              name="message"
              placeholder="Write your message..."
              required
              className="w-full p-3 rounded-xl bg-zinc-800 h-32 focus:outline-none focus:ring focus:ring-zinc-600"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-white py-3 text-black rounded-xl font-semibold cursor-pointer hover:bg-gray-400 transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {success === true && (
            <p className="text-green-400 text-center">Message sent successfully!</p>
          )}

          {success === false && (
            <p className="text-red-400 text-center">Failed to send message. Try again.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ContactPage;
