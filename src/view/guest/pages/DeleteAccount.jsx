import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/policy.css";

function DeleteAccount() {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="container">
          <span className="policy-badge">
            ACCOUNT DELETION
          </span>

          <h1>Delete Your Account</h1>

          <p>
            You may permanently delete your Stakeova
            account at any time from within your account
            settings.
          </p>

          <small>Last Updated: June 2026</small>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">

          <h3>How to Delete Your Account</h3>

          <ol>
            <li>Log in to your Stakeova account.</li>
            <li>Open your Profile page.</li>
            <li>Scroll to the <strong>Danger Zone</strong>.</li>
            <li>Enter your account PIN.</li>
            <li>Click <strong>Delete My Account</strong>.</li>
            <li>Confirm the deletion.</li>
          </ol>

          <h3>What Happens When You Delete Your Account?</h3>

          <p>
            Account deletion is permanent and cannot be
            reversed.
          </p>

          <ul>
            <li>Your account will be permanently removed.</li>
            <li>Your wallet balance will be lost.</li>
            <li>Your prediction history will be deleted.</li>
            <li>Your rewards and statistics will be removed.</li>
            <li>Your profile information will no longer be accessible.</li>
          </ul>

          <div className="policy-alert">
            <strong>Important</strong>

            <p>
              Before deletion, any pending withdrawals,
              disputes, investigations, or other unresolved
              activities must be completed. Certain records
              may be retained where required by law,
              fraud prevention, accounting, or regulatory
              compliance.
            </p>
          </div>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <Link className="policy-button" to="/profile">
              Go to Profile to Delete My Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;