import React, { useEffect, useState } from "react";
import ApiUrl from "../../../constants/ApiUrl";

import "../../../assets/css/reward.css";

import { useAuth } from "../../../contexts/AuthContext";

export default function Reward() {
  const { user, token } = useAuth();
  const [rewardData, setRewardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!rewardData?.test?.end_date) return;

    const timer = setInterval(() => {
      const end = new Date(rewardData.test.end_date).getTime();

      const now = new Date().getTime();

      const distance = end - now;

      if (distance <= 0) {
        setCountdown("Ended");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [rewardData]);

  const getOrdinal = (day) => {
    const s = ["th", "st", "nd", "rd"];
    const v = day % 100;

    return day + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not Set";

    const date = new Date(dateString);

    const day = getOrdinal(date.getDate());

    const month = date.toLocaleString("en-US", {
      month: "long",
    });

    const year = date.getFullYear();

    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return `${day} ${month}, ${year} ${time}`;
  };

  const fetchRewardDashboard = async () => {
    try {
      if (!user || !token) return;

      const rewardRes = await fetch(`${ApiUrl.REWARD_DASHBOARD}/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const text = await rewardRes.text();

      console.log("REWARD RESPONSE:", text);

      const rewardJson = JSON.parse(text);

      if (rewardJson.status) {
        setRewardData(rewardJson);
      }
    } catch (e) {
      console.log("REWARD ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) return;

    fetchRewardDashboard();

    const interval = setInterval(() => {
      fetchRewardDashboard();
    }, 10000);

    return () => clearInterval(interval);
  }, [user, token]);

  if (loading) {
    return (
      <div className="reward-loading">
        <h3>Loading Rewards...</h3>
      </div>
    );
  }

  return (
    <div className="reward-page container py-4">
     <div className="reward-hero">
  <h1>🏆 Rewards Arena</h1>

  <p>
    Climb the leaderboard, earn points, and claim your share of the
    reward pool.
  </p>
</div>

      {/* TOP CARDS */}

      <div className="reward-grid">
        <div className="reward-card">
          <span>Prize Pool</span>

          <h2>₦{Number(rewardData?.reward_pool || 0).toLocaleString()}</h2>
        </div>

        <div className="reward-card">
          <span>Your Rank</span>

          <h2>#{rewardData?.user?.rank || "-"}</h2>
        </div>

        <div className="reward-card">
          <span>Reward Balance</span>

          <h2>
            ₦{Number(rewardData?.user?.reward_balance || 0).toLocaleString()}
          </h2>
        </div>

        <div className="reward-card">
          <span>Point Value</span>

          <h2>₦{Number(rewardData?.point_value || 0).toFixed(2)}</h2>
        </div>
      </div>

      {/* USER STATS */}

      <div className="reward-grid">
        <div className="reward-card">
          <span>Total Points</span>

          <h2>{rewardData?.user?.total_points || 0}</h2>
        </div>

        <div className="reward-card">
          <span>Today's Points</span>

          <h2>{rewardData?.user?.today_points || 0}</h2>
        </div>

        <div className="reward-card">
          <span>Remaining Today</span>

          <h2>{rewardData?.user?.remaining_today_points || 0}</h2>
        </div>

        <div className="reward-card">
          <span>Global Points</span>

          <h2>{rewardData?.global_total_points || 0}</h2>
        </div>
      </div>

      {/* TEST DETAILS */}

      <div className="reward-test-card">
        <h3>🚀 Reward Test Campaign</h3>

        <div className="reward-test-grid">
          <div>
            <strong>Start Date</strong>

            <p>{formatDateTime(rewardData?.test?.start_date)}</p>
          </div>

          <div>
            <strong>End Date</strong>

            <p>{formatDateTime(rewardData?.test?.end_date)}</p>
          </div>

          <div>
            <strong>Days Remaining</strong>

            <p>{countdown}</p>
          </div>
        </div>
      </div>

      {/* LEADERBOARD */}

      <div className="reward-leaderboard">
        <h3>🥇 Top Players</h3>

        <div className="table-responsive">
          <table className="reward-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Total Points</th>
                <th>Daily Points</th>
                <th>Reward Balance</th>
              </tr>
            </thead>

            <tbody>
              {rewardData?.leaderboard?.map((player) => (
                <tr key={`${player.user_id}-${player.rank}`}>
                  <td>#{player.rank}</td>

                  <td>{player.username}</td>

                  <td>{player.points}</td>

                  <td>{player.today_points}</td>

                  <td>₦{Number(player.reward_balance).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
