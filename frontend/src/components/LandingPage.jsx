// import LeadForm from './LeadForm.jsx';

// function LandingPage() {
//   return (
//     <main>
//       <section style={{ background: '#e2e8f0', padding: '48px 0' }}>
//         <div className="container" style={{ display: 'grid', gap: '16px' }}>
//           <div>
//             <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>
//               Done-For-You Branding, UI/UX & Web Development – Tell Us About Your Project
//             </h2>
//             <p style={{ fontSize: '16px', color: '#475569' }}>
//               Share a few details and we will craft a tailored plan to bring your digital vision to life.
//             </p>
//           </div>
//           <div className="card">
//             <LeadForm />
//           </div>
//         </div>
//       </section>

//       <section style={{ padding: '32px 0' }}>
//         <div className="container">
//           <h3>Why work with us</h3>
//           <ul>
//             <li>Senior designers and developers aligned to your brand.</li>
//             <li>Clear communication with weekly updates.</li>
//             <li>Flexible engagement from discovery to launch.</li>
//           </ul>
//         </div>
//       </section>
//     </main>
//   );
// }

// export default LandingPage;

import LeadForm from "./LeadForm.jsx";

function LandingPage() {
  return (
    <main>
      {/* HERO + VIDEO + STEPS */}
      <section style={{ background: "#f1f5f9", padding: "60px 0" }}>
        <div
          className="container"
          style={{ display: "grid", gap: "24px", maxWidth: "900px" }}
        >
          {/* Headline + Positioning */}
          <div>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "700",
                marginBottom: "12px",
              }}
            >
              Premium Branding, UI/UX & Web Development for Businesses Ready to
              Grow
            </h1>

            <p style={{ fontSize: "18px", color: "#475569" }}>
              If you want a professional online presence that attracts customers
              and builds trust— you’re in the right place.
            </p>
          </div>

          {/* Explainer video placeholder */}
          <div
            style={{
              background: "#000",
              height: "380px",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Replace this iframe src with your real hosted video link later */}
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Explainer Video"
              style={{ border: "none" }}
              allowFullScreen
            />
          </div>

          {/* Steps */}
          <div
            style={{
              background: "white",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>
              👉 Step 1: Watch the short video above
            </p>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>
              👉 Step 2: Complete the project form below
            </p>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>
              👉 Step 3: Book your consultation on the next page
            </p>
          </div>

          {/* Form */}
          <div className="card" style={{ padding: "24px" }}>
            <LeadForm />
          </div>

          {/* CTA copy */}
          <p
            style={{ fontSize: "14px", textAlign: "center", color: "#64748b" }}
          >
            After submitting, you’ll be redirected to choose a date & time for
            your consultation.
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>
            Why work with us?
          </h3>
          <ul style={{ color: "#475569" }}>
            <li>Experienced designers and developers across disciplines.</li>
            <li>Clear communication and structured delivery.</li>
            <li>Reliable timelines and milestone-based workflow.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
