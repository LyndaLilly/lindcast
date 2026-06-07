import React, { useEffect, useState } from "react";
import ApiUrl from "../../../constants/ApiUrl";

import "../../../assets/css/board.css";

const getUserImage = (user) => {
  // Uploaded profile image
  if (user?.profile_image) {
    if (user.profile_image.startsWith("http")) {
      return user.profile_image;
    }

    return `${ApiUrl.IMAGE_BASE_URL}/${user.profile_image}`;
  }

  // Default avatar
  if (user?.avatar) {
    return `${ApiUrl.IMAGE_BASE_URL}/avatars/${user.avatar}.jpg`;
  }

  return "https://cdn.vectorstock.com/i/500p/48/31/emo-teen-avatar-vector-4304831.jpg";
};

function LeaderBoard() {
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState([]);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(ApiUrl.LEADERBOARD);
      const data = await res.json();
      console.log("LEADERBOARD", data.leaderboard);

      setLeaders(data.leaderboard || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredLeaders = leaders.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase()),
  );

  const displayedLeaders = showAll
    ? filteredLeaders
    : filteredLeaders.slice(0, 20);

  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="container">
          <span className="policy-badge">PLATFORM LEADERBOARD</span>

          <h1>Top Winners</h1>

          <p>
            Ranked by total winnings earned across Market Predictions and
            Challenge Predictions.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="policy-card">
          {loading ? (
            <div className="text-center py-5">
              <h4>Loading leaderboard...</h4>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-5">
              <h4>No leaderboard data available.</h4>
            </div>
          ) : (
            <>
              {/* TOP 3 */}
              {/* <div className="leaderboard-podium">
                {leaders.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className={`podium-card podium-${index + 1}`}
                  >
                    <div className="podium-rank">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>

                    <img
                      src={getUserImage(user)}
                      alt={user.username}
                      className="podium-avatar"
                    />

                    <h5>@{user.username}</h5>

                    <h3>₦{Number(user.total_won || 0).toLocaleString()}</h3>
                  </div>
                ))}
              </div> */}

              {/* FULL TABLE */}

              <div className="leaderboard-tools">
                <input
                  type="text"
                  className="leaderboard-search"
                  placeholder="Search username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="leaderboard-count">
                  {filteredLeaders.length} Players Found
                </div>
              </div>

              <div className="table-responsive">
                <div className="leaderboard-table mt-5">
                  <div className="leaderboard-header">
                    <div>Ranking</div>
                    <div>Player</div>
                    <div>Total Winnings</div>
                  </div>

                  {displayedLeaders.map((user) => {
                    const rank = leaders.findIndex((u) => u.id === user.id) + 1;

                    return (
                      <div className="leaderboard-row" key={user.id}>
                        <div className="leaderboard-col rank-col">#{rank}</div>

                        <div className="leaderboard-col player-col">
                          <img
                            src={getUserImage(user)}
                            alt={user.username}
                            className="leaderboard-avatar"
                          />

                          <strong>@{user.username}</strong>
                        </div>

                        <div className="leaderboard-col winnings-col">
                          ₦{Number(user.total_won || 0).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredLeaders.length > 20 && (
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-success"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? "See less" : "See more"}
                    </button>
                  </div>
                )}
                
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
