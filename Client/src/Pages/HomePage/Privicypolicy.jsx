import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Privicypolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-28 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">
          PRIVACY POLICY
        </h1>
        <p className="mb-6">
          This Privacy Policy outlines how Diamond Ore Consulting Pvt. Ltd.
          (“we”, “our”, or “us”) collects, uses, shares, and protects the
          personal information of users visiting our website.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          1. INFORMATION WE COLLECT
        </h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>
            <strong>Personal Identification Information:</strong> Name, email
            address, phone number, work experience, resume, and location.
          </li>
          <li>
            <strong>Employer/Client Information:</strong> Company name, contact
            information, job requirements.
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type, access
            time, cookies, device type.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">2. PURPOSE OF COLLECTION</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>To process job applications or candidate assessments.</li>
          <li>To provide staffing or HR consulting services.</li>
          <li>To respond to inquiries or requests.</li>
          <li>To improve the functionality and content of our website.</li>
          <li>
            To send service-related emails or updates (no promotional emails
            without consent).
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">3. COOKIES</h2>
        <p className="mb-6">
          We use cookies to track website usage, improve performance, and
          customize user experience. You may disable cookies in your browser
          settings if you wish.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          4. SHARING OF INFORMATION
        </h2>
        <p className="mb-2">
          We do not sell your personal information. However, we may share data
          with:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Authorized internal employees and recruiters.</li>
          <li>
            Verified clients seeking recruitment services (with prior consent).
          </li>
          <li>Law enforcement agencies when required under applicable laws.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">5. DATA SECURITY</h2>
        <p className="mb-6">
          We implement industry-standard security measures to protect your data,
          including SSL encryption, firewalls, and limited access policies.
        </p>

        <h2 className="text-xl font-semibold mb-2">6. USER RIGHTS</h2>
        <p className="mb-2">
          Under Indian data protection guidelines, you have the right to:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Request access to your personal data.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Withdraw consent to process data.</li>
        </ul>
        <p className="mb-6">
          Please write to us at <strong>[Insert Email]</strong> for any
          data-related requests.
        </p>

        <h2 className="text-xl font-semibold mb-2">7. DATA RETENTION</h2>
        <p className="mb-6">
          Your data is retained only as long as necessary for the purpose for
          which it was collected or as required under applicable laws.
        </p>

        <h2 className="text-xl font-semibold mb-2">8. CHILDREN’S PRIVACY</h2>
        <p className="mb-6">
          Our services are not intended for individuals under 18. We do not
          knowingly collect personal information from minors.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          9. CHANGES TO THIS POLICY
        </h2>
        <p className="mb-6">
          We may update this Privacy Policy occasionally. Any changes will be
          posted on this page with an updated effective date.
        </p>

        <h2 className="text-xl font-semibold mb-2">10. CONTACT US</h2>
        <p className="mb-2">
          For questions about this policy or to exercise your data rights,
          please contact:
        </p>
        <div className="mb-1">🏢 Diamond Ore Consulting Pvt. Ltd.</div>
        <div className="mb-1">
          📍 B-127, Second Floor, B Block, Sector 63, Noida, Uttar Pradesh
          201301
        </div>
        <div className="mb-1">📞 7838738916</div>
        <div className="mb-6">📧 hr@diamondore.in</div>
      </div>
      <Footer />
    </div>
  );
};

export default Privicypolicy;
