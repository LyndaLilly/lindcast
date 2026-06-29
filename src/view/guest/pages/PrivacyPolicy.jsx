import React from "react";
import "../../../assets/css/policy.css";


function PrivacyPolicy() {
  return (
    <div className="policy-page">
      {/* HERO */}
      <div className="policy-hero">
        <div className="container">
          <span className="policy-badge">
            PRIVACY & DATA PROTECTION
          </span>

          <h1>Privacy Policy</h1>

          <p>
            Learn how Stakeova collects, stores,
            protects, and uses your information while
            providing cryptocurrency prediction markets
            and challenge prediction services.
          </p>

          <small>Last Updated: June 2026</small>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          <h3>1. Information We Collect</h3>

          <p>
            To operate the platform securely and provide
            our services, we may collect the following
            information:
          </p>

          <ul>
            <li>Username</li>
            <li>Email Address</li>
            <li>Security PIN</li>
            <li>Profile Image or Avatar (Optional)</li>
            <li>Full Name as registered with your bank</li>
            <li>Bank Account Information</li>
          </ul>

          <p>
            We may also collect transaction records,
            prediction history, challenge activity,
            deposit records, withdrawal requests, and
            device information for security and
            operational purposes.
          </p>

          <h3>2. Why We Collect Information</h3>

          <p>We use collected information to:</p>

          <ul>
            <li>Create and maintain user accounts</li>
            <li>Process deposits and withdrawals</li>
            <li>Verify account ownership</li>
            <li>Protect users from fraud</li>
            <li>Provide customer support</li>
            <li>Improve platform performance</li>
            <li>Maintain transaction records</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h3>3. Wallet Funding & Withdrawals</h3>

          <p>
            Users may fund their wallets and use their
            available balances to participate in market
            predictions and challenge predictions.
          </p>

          <div className="policy-alert">
            <strong>Important Withdrawal Policy</strong>

            <p>
              Only one withdrawal request may be active
              at any given time. A new withdrawal request
              cannot be submitted until the previous one
              has been completed.
            </p>
          </div>

          <p>
            Withdrawal requests are normally processed
            within 24 hours or less.
          </p>

          <p>
            Users may withdraw part or all of their
            available wallet balance at any time,
            subject to security verification and
            platform review.
          </p>

          <h3>4. Market Predictions</h3>

          <p>
            Users may participate in prediction markets
            by selecting a cryptocurrency, prediction
            direction, leverage option, and stake amount.
          </p>

          <p>
            Market prices are sourced from live market
            data and are not manually manipulated by
            Stakeova.
          </p>

          <p>
            Once a market prediction has been placed,
            it cannot be cancelled, reversed, or edited.
          </p>

          <h3>5. Challenge Predictions</h3>

          <p>
            Users may create Challenge Predictions that
            allow another user to join and compete
            directly against them.
          </p>

          <p>
            Challenge Predictions involve two
            participants only.
          </p>

          <p>
            The participant with the winning prediction
            receives the winnings directly into their
            wallet balance after settlement.
          </p>

          <p>
            A Challenge Prediction may be cancelled only
            if no opponent has joined.
          </p>

          <p>
            Once another participant joins and the
            challenge becomes active, cancellation is no
            longer permitted.
          </p>

          <h3>6. Platform Fees</h3>

          <p>
            Stakeova retains a 10% platform fee
            from successful prediction winnings.
          </p>

          <p>
            The remaining winnings are credited directly
            to the winner's wallet balance.
          </p>

          <p>
            This fee applies to both Market Predictions
            and Challenge Predictions.
          </p>

          <h3>7. Bank Information</h3>

          <p>
            Accurate bank information is required for
            withdrawal processing.
          </p>

          <p>
            Users are responsible for ensuring that
            submitted bank details belong to them and
            are accurate.
          </p>

          <p>
            For security reasons, bank details cannot be
            changed freely from within the platform.
          </p>

          <p>
            Requests to change bank information must be
            submitted through customer support and may
            require identity verification.
          </p>

          <h3>8. Data Protection & Security</h3>

          <p>
            We implement reasonable technical and
            organizational measures to protect user
            information from unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <p>
            Although we work to maintain a secure
            platform, no online system can guarantee
            absolute security.
          </p>

          <h3>9. Information Sharing</h3>

          <p>
            We do not sell personal information to third
            parties.
          </p>

          <p>
            Information may be shared when required by
            law, regulatory obligations, fraud
            investigations, payment processing services,
            or to protect the rights and security of the
            platform and its users.
          </p>

          <h3>10. Account Deletion</h3>

          <p>
            Users may request account deletion at any
            time.
          </p>

          <p>
            Before account deletion is completed, all
            pending withdrawals, disputes, reviews, and
            unresolved transactions must be settled.
          </p>

          <p>
            Certain records may be retained for legal,
            accounting, fraud prevention, and compliance
            purposes.
          </p>

          <h3>11. User Responsibilities</h3>

          <ul>
            <li>Maintain account security</li>
            <li>Protect login credentials and PINs</li>
            <li>Provide accurate information</li>
            <li>Use the platform lawfully</li>
            <li>Protect access to their devices</li>
          </ul>

          <h3>12. Changes to This Policy</h3>

          <p>
            Stakeova may update this Privacy
            Policy periodically.
          </p>

          <p>
            Updates become effective immediately upon
            publication on the platform.
          </p>

          <h3>13. Contact Support</h3>

          <p>
            Questions regarding privacy, withdrawals,
            security, account deletion, or personal
            information may be directed to our support
            team through the official support channels
            provided on the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;