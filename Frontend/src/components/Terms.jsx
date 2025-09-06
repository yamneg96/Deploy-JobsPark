// Terms.jsx
import React from 'react';
import { X } from 'lucide-react';

/**
 * A modal component to display the terms and conditions.
 * It appears as a fixed overlay with a scrollable content area.
 * * @param {object} props - The component props.
 * @param {boolean} props.visible - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 */
const Terms = ({ visible, onClose }) => {
  // If not visible, render nothing. This prevents the modal from existing in the DOM.
  if (!visible) {
    return null;
  }

  return (
    // Modal overlay container.
    // Fixed position to cover the entire viewport.
    // Tailwind classes for a dark, semi-transparent background and blur effect.
    // Clicking the overlay also closes the modal.
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal content container. */}
      {/* Centered with flexbox, with a max-width and height to ensure scrollability. */}
      {/* The `onClick={(e) => e.stopPropagation()}` prevents the click event from bubbling up to the overlay. */}
      <div 
        className="bg-white text-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button. */}
        {/* Positioned at the top right of the modal content box. */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Scrollable content area for the terms. */}
        <div className="overflow-y-auto pr-2 max-h-[calc(80vh-4rem)]">
          <h2 className="text-2xl font-extrabold text-center text-blue-800 mb-4">JobsPark Terms and Conditions</h2>
          <p className="text-sm text-center text-gray-500 mb-6">Last Updated: July 27, 2025</p>
          
          <p className='mt-2'> 
            Welcome to JobsPark! By using our platform—whether as a client seeking services or 
            a worker offering them—you agree to the following Terms and Conditions. 
            Please read them carefully.
          </p>

          <h3 className="text-lg font-bold mt-4 mb-2">1. Introduction</h3>
          <p>
            JobsPark is an online service marketplace that connects clients with skilled local workers for various 
            services (e.g., plumbing, electrical, cleaning, etc.). These Terms govern your use of our web and mobile platforms.
          </p>

          <h3 className="text-lg font-bold mt-4 mb-2">2. Definitions</h3>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Platform:</strong> JobsPark and all associated services and technologies.</li>
            <li><strong>Client:</strong> Any individual or entity seeking to book services through the platform.</li>
            <li><strong>Worker:</strong> Any service provider registered on the platform.</li>
            <li><strong>User:</strong> Includes both clients and workers.</li>
          </ul>

          <h3 className="text-lg font-bold mt-4 mb-2">3. Acceptance of Terms</h3>
          <p>
            By creating an account, browsing, posting, booking, or accepting a job, you acknowledge that you’ve read, understood, and agreed to these terms. If you do not agree, please do not use the platform.
          </p>
          
          <h3 className="text-lg font-bold mt-4 mb-2">4. Platform Role and Limitations</h3>
          <p>
            JobsPark is a facilitator only. We do not directly employ workers, guarantee services, or oversee job completion. The platform provides tools for:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Discovering and posting services</li>
            <li>Messaging and booking</li>
            <li>Handling payments and ratings</li>
          </ul>
          <p className="mt-2">JobsPark is not responsible for:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>The quality, safety, or legality of the services</li>
            <li>The conduct of clients or workers</li>
            <li>Job disputes or service outcomes</li>
          </ul>

          <h3 className="text-lg font-bold mt-4 mb-2">5. Relationship Between Clients and Workers</h3>
          <p>
            <strong>5.1 Service Agreement</strong><br />
            When a client books a service, it forms a direct agreement between the client and the worker. JobsPark is not a party to this contract.<br />
            <strong>5.2 Dispute Resolution</strong><br />
            We encourage users to resolve any disputes privately. JobsPark may provide informal mediation but does not guarantee resolution. Escrow disputes (if enabled) may be handled via predefined rules.<br />
            <strong>5.3 Reviews</strong><br />
            After each job, both parties may leave public reviews. JobsPark does not alter reviews unless they violate community standards (e.g., hate speech, threats, spam).
          </p>

          <h3 className="text-lg font-bold mt-4 mb-2">6. User Responsibilities</h3>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Clients Must:</strong>
              <ul className="list-circle list-inside ml-4 space-y-1">
                <li>Provide accurate job descriptions</li>
                <li>Pay agreed fees promptly</li>
                <li>Treat workers with respect and professionalism</li>
              </ul>
            </li>
            <li className="mt-2"><strong>Workers Must:</strong>
              <ul className="list-circle list-inside ml-4 space-y-1">
                <li>Offer services honestly and perform jobs reliably</li>
                <li>Arrive on time or communicate delays</li>
                <li>Only accept jobs they are qualified to complete</li>
              </ul>
            </li>
          </ul>
          
          <h3 className="text-lg font-bold mt-4 mb-2">7. Payments and Fees</h3>
          <p>
            Payments may be handled directly or through escrow if enabled. JobsPark may deduct a small service fee from payments to workers. Refund policies depend on service category and whether the job was canceled fairly.
          </p>

          <h3 className="text-lg font-bold mt-4 mb-2">8. Account and Data Usage</h3>
          <p>
            Users are responsible for maintaining the security of their accounts. JobsPark respects your privacy and protects data under applicable laws. Misuse of the platform, fraud, or harassment will lead to account suspension.
          </p>

          <h3 className="text-lg font-bold mt-4 mb-2">9. Liability Disclaimer</h3>
          <p>
            JobsPark does not guarantee the outcome of any service. While we verify some worker credentials, we do not warrant the professionalism or behavior of either party. Use the platform at your own risk.
          </p>
          
          <h3 className="text-lg font-bold mt-4 mb-2">10. Termination of Access</h3>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms, our community guidelines, or local laws.
          </p>
          
          <h3 className="text-lg font-bold mt-4 mb-2">11. Modifications</h3>
          <p>
            JobsPark may update these Terms at any time. Users will be notified of major changes via email or platform notification.
          </p>

          <h3 className="text-lg font-bold mt-4 mb-2">12. Governing Law</h3>
          <p>
            These terms are governed by the laws of [Ethiopia or relevant local jurisdiction]. Disputes may be resolved under local arbitration if applicable.
          </p>
          
          <h3 className="text-lg font-bold mt-4 mb-2">13. Contact Us</h3>
          <p>
            If you have questions about these Terms, you can reach us at:<br />
            📧 <a href="mailto:support@jobspark.com" className="text-blue-500 hover:underline">support@jobspark.com</a><br />
            📞 +251902142767
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
