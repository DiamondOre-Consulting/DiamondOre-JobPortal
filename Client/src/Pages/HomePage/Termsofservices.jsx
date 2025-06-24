import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Termsofservices = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800 py-28">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">
          TERMS &amp; CONDITIONS
        </h1>

        <p className="mb-6">
          Welcome to the official website of Diamond Ore Consulting Pvt. Ltd.
          (“Company”, “we”, “our”, or “us”). These Terms &amp; Conditions govern
          your use of our website and services. By accessing or using our
          website, you agree to be bound by these terms. If you do not agree,
          kindly exit the website.
        </p>

        <h2 className="text-xl font-semibold mb-2">1. DEFINITIONS</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>
            “User”, “you”, or “your” refers to any natural or legal person
            accessing our website.
          </li>
          <li>
            “Services” means recruitment and HR consulting services offered
            through this website.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">2. ACCEPTANCE OF TERMS</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>You are at least 18 years of age.</li>
          <li>
            You are legally competent to enter into a binding contract under
            Indian Contract Act, 1872.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">3. USE OF WEBSITE</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>
            Not to use this website for any unlawful, unauthorized, or
            fraudulent purpose.
          </li>
          <li>
            Not to try to gain unauthorized access to any part of this website,
            its systems, or networks.
          </li>
          <li>
            To provide accurate, complete, and up-to-date information through
            contact forms or job applications.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">4. INTELLECTUAL PROPERTY</h2>
        <p className="mb-6">
          All content, graphics, logos, and software on this website are the
          property of Diamond Ore Consulting Pvt. Ltd. and protected by
          applicable intellectual property laws. Unauthorized use, reproduction,
          or distribution is prohibited.
        </p>

        <h2 className="text-xl font-semibold mb-2">5. THIRD-PARTY LINKS</h2>
        <p className="mb-6">
          This website may contain links to external websites. We are not
          responsible for the content or privacy practices of such third
          parties.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          6. DISCLAIMER OF WARRANTIES
        </h2>
        <p className="mb-6">
          The information provided on this website is for general information
          purposes only. We make no warranties regarding the accuracy or
          completeness of the content and disclaim any liability arising from
          reliance on the information.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          7. LIMITATION OF LIABILITY
        </h2>
        <p className="mb-6">
          To the fullest extent permitted by law, we shall not be liable for any
          direct, indirect, incidental, consequential, or special damages
          arising from your use of the website.
        </p>

        <h2 className="text-xl font-semibold mb-2">8. TERMINATION</h2>
        <p className="mb-6">
          We reserve the right to restrict or terminate your access to the
          website without prior notice if we believe that you have breached
          these terms.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          9. GOVERNING LAW &amp; JURISDICTION
        </h2>
        <p className="mb-6">
          These terms are governed by the laws of India. Courts in Noida shall
          have exclusive jurisdiction over any disputes.
        </p>

        <h2 className="text-xl font-semibold mb-2">10. CHANGES TO TERMS</h2>
        <p className="mb-6">
          We reserve the right to modify these Terms &amp; Conditions at any
          time. Continued use of the website will mean you accept those changes.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Termsofservices;
