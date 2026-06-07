import React, { useEffect, useState } from "react";
import "../assets/css/home.css";
import { Link } from "react-router-dom";
import ApiUrl from "../constants/ApiUrl";

const getUserImage = (user) => {
  if (!user?.image && !user?.profile_image) {
    return "https://cdn.vectorstock.com/i/500p/48/31/emo-teen-avatar-vector-4304831.jpg";
  }

  const imagePath = user?.image || user?.profile_image;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${ApiUrl.IMAGE_BASE_URL}/${imagePath}`;
};

function FeedCard() {
  const [scrolled, setScrolled] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [coins, setCoins] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeBets, setActiveBets] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  const [loadingCoins, setLoadingCoins] = useState(true);
  const [coinsLoaded, setCoinsLoaded] = useState(false);

  const [tickerCoins, setTickerCoins] = useState([]);
  const [marketCoins, setMarketCoins] = useState([]);

  // ================= SCROLL =================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ================= FETCH USER =================

  const fetchMe = async () => {
    if (!token) return;

    try {
      const res = await fetch(ApiUrl.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setUser(data.user || data);
    } catch (e) {
      console.log(e);
    }
  };

  // ================= FETCH WALLET =================

  const fetchWallet = async () => {
    if (!token) return;

    try {
      const res = await fetch(ApiUrl.WALLET, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("WALLET RESPONSE:", data);

      setWallet(Number(data.wallet) || 0);
    } catch (e) {
      console.log(e);
    }
  };

  // ================= FETCH ACTIVE BETS =================

  const fetchActiveBets = async () => {
    if (!token) return;

    try {
      const res = await fetch(ApiUrl.ACTIVE_BETS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setActiveBets(data.bets || []);
    } catch (e) {
      console.log(e);
    }
  };

  // ================= FETCH LIVE FEED =================

  const fetchFeed = async () => {
    try {
      const res = await fetch(ApiUrl.LIVE_FEED);

      const data = await res.json();

      setActivities(data.feed || []);
    } catch (e) {
      console.log(e);
    }
  };

  // ================= FETCH COINS =================

  const fetchCoins = async () => {
    try {
      // ONLY SHOW LOADER FIRST TIME
      if (!coinsLoaded) {
        setLoadingCoins(true);
      }

      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,the-open-network&vs_currencies=usd&include_24hr_change=true",
      );

      const data = await res.json();

      const formatted = [
        {
          coin: "BTC",
          price: data.bitcoin?.usd || 0,
          change: data.bitcoin?.usd_24h_change || 0,
          image:
            "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        },
        {
          coin: "ETH",
          price: data.ethereum?.usd || 0,
          change: data.ethereum?.usd_24h_change || 0,
          image:
            "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        },
        {
          coin: "SOL",
          price: data.solana?.usd || 0,
          change: data.solana?.usd_24h_change || 0,
          image:
            "https://assets.coingecko.com/coins/images/4128/large/solana.png",
        },
        {
          coin: "XRP",
          price: data.ripple?.usd || 0,
          change: data.ripple?.usd_24h_change || 0,
          image:
            "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
        },
        {
          coin: "TON",
          price: data["the-open-network"]?.usd || 0,
          change: data["the-open-network"]?.usd_24h_change || 0,
          image:
            "https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png",
        },
        {
          coin: "DOGE",
          price: data.dogecoin?.usd || 0,
          change: data.dogecoin?.usd_24h_change || 0,
          image:
            "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
        },
      ];

      setTickerCoins(formatted);

      setMarketCoins(
        formatted.filter((coin) => !["DOGE", "XRP"].includes(coin.coin)),
      );

      setCoinsLoaded(true);
    } catch (e) {
      console.log("COIN ERROR:", e);
    } finally {
      setLoadingCoins(false);
    }
  };

 

  useEffect(() => {
    const loadPage = async () => {
      try {
        await Promise.all([
          fetchCoins(),
          fetchFeed(),
          fetchHomeFeed(),
          fetchLeaderboard(),
          fetchTotalPayout(),
          token ? fetchMe() : Promise.resolve(),
          token ? fetchWallet() : Promise.resolve(),
          token ? fetchActiveBets() : Promise.resolve(),
        ]);
      } catch (e) {
        console.log(e);
      } finally {
        setTimeout(() => {
          setPageLoading(false);
        }, 100);
      }
    };

    loadPage();
  }, [token]);

  const profileImage = getUserImage(user);

  const [winnerIndex, setWinnerIndex] = useState(0);

  useEffect(() => {
    if (!activities.length) return;

    const timer = setInterval(() => {
      setWinnerIndex((prev) => (prev >= activities.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [activities]);

  const getFeedUserImage = (item) => {
    if (item.profile_image) {
      return `${ApiUrl.IMAGE_BASE_URL}/${item.profile_image}`;
    }

    if (item.avatar) {
      return `${ApiUrl.IMAGE_BASE_URL}/avatars/${item.avatar}.jpg`;
    }

    return "https://cdn.vectorstock.com/i/500p/48/31/emo-teen-avatar-vector-4304831.jpg";
  };

  const [liveActivities, setLiveActivities] = useState([]);
  const [marketActiveBets, setMarketActiveBets] = useState([]);

  const [challengeArena, setChallengeArena] = useState({
    pending: [],
    active: [],
    completed: [],
  });

  const fetchHomeFeed = async () => {
    try {
      const res = await fetch(ApiUrl.HOME_FEED);

      const data = await res.json();

      console.log("HOME FEED", data);

      setChallengeArena(
        data.challenge_summary || {
          pending: [],
          active: [],
          completed: [],
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTotalPayout = async () => {
    try {
      const res = await fetch(ApiUrl.TOTAL_PAYOUT);
      const data = await res.json();

      setTotalPayout(data.total_payout || 0);
    } catch (e) {
      console.log(e);
    }
  };

  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(ApiUrl.LEADERBOARD);
      const data = await res.json();

      setLeaderboard(data.leaderboard || []);
    } catch (e) {
      console.log(e);
    }
  };

  return (

  <section className="hero-section">
    <div className="container">
      <div className="row min-vh-lg-100">
        {/* LEFT */}
        <div className="col-lg-6">
          <div className="platform-stats-card">
            <div className="stats-header">📊 PLATFORM OVERVIEW</div>

            <div className="stats-grid">
              <div className="stat-box">
                <h2>₦12.5M+</h2>
                <p>Total Rewards Paid</p>
              </div>

              <div className="stat-box">
                <h2>{activities.length}</h2>
                <p>Active Traders</p>
              </div>

              <div className="stat-box">
                <h2>24/7</h2>
                <p>Markets Running</p>
              </div>

              <div className="stat-box">
                <h2>{activeBets.length}</h2>
                <p>Live Predictions</p>
              </div>
            </div>
          </div>

          <div className="challenge-arena-card">
            <div className="card-label">⚔️ CHALLENGE ARENA</div>

            {/* PENDING CHALLENGES */}
            {challengeArena.pending?.length > 0 && (
              <>
                <div className="arena-section-title">Open Challenges</div>

                {challengeArena.pending.slice(0, 5).map((bet) => (
                  <div className="arena-row" key={bet.id}>
                    <div className="arena-user">
                      <img
                        src={getUserImage(bet.creator)}
                        alt=""
                        className="arena-avatar"
                      />

                      <div>
                        <strong>{bet.creator?.username}</strong>

                        <small>Waiting for an opponent</small>
                      </div>
                    </div>

                    <div className="arena-right">
                      <span className="arena-coin">
                        {bet.coin?.toUpperCase()}
                      </span>

                      <strong>₦{Number(bet.amount).toLocaleString()}</strong>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ACTIVE CHALLENGES */}
            {challengeArena.active?.length > 0 && (
              <>
                <div className="arena-section-title mt-4">Live Battles</div>

                {challengeArena.active.slice(0, 5).map((bet) => (
                  <div className="arena-row" key={bet.id}>
                    <div className="arena-vs">
                      <img
                        src={getUserImage(bet.creator)}
                        alt=""
                        className="arena-avatar"
                      />

                      <span className="arena-vs-text">VS</span>

                      <img
                        src={getUserImage(bet.opponent)}
                        alt=""
                        className="arena-avatar"
                      />
                    </div>

                    <div className="arena-right">
                      <div>{bet.coin?.toUpperCase()}</div>

                      <small>
                        Ends {new Date(bet.end_time).toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* COMPLETED */}
            {challengeArena.pending?.length === 0 &&
              challengeArena.active?.length === 0 && (
                <>
                  <div className="arena-section-title">Recent Results</div>

                  {challengeArena.completed?.slice(0, 6).map((bet) => (
                    <div className="arena-row" key={bet.id}>
                      <div className="arena-user">
                        <img
                          src={getUserImage(bet.winner)}
                          alt=""
                          className="arena-avatar"
                        />

                        <div>
                          <strong>{bet.winner?.username}</strong>

                          <small> defeated {bet.loser?.username} </small>
                        </div>
                      </div>

                      <div className="arena-right">
                        <span className="arena-win">
                          ₦{Number(bet.amount * 2).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-6">
          <div className="dashboard-card">
            {/* WALLET */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p className="wallet-label">Available Balance</p>

                <h2 className="wallet-balance">
                  ₦{Number(wallet || 0).toLocaleString()}
                </h2>
              </div>

            
            </div>

            {/* MARKET */}
            {loadingCoins ? (
              <>
                {[1, 2, 3, 4].map((item) => (
                  <div className="market-card" key={item}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: "50%",
                          background: "#2a2a2a",
                          animation: "pulse 1.5s infinite",
                        }}
                      ></div>

                      <div>
                        <div
                          style={{
                            width: 90,
                            height: 12,
                            borderRadius: 6,
                            background: "#2a2a2a",
                            marginBottom: 8,
                            animation: "pulse 1.5s infinite",
                          }}
                        ></div>

                        <div
                          style={{
                            width: 60,
                            height: 10,
                            borderRadius: 6,
                            background: "#2a2a2a",
                            animation: "pulse 1.5s infinite",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-end">
                      <div
                        style={{
                          width: 70,
                          height: 12,
                          borderRadius: 6,
                          background: "#2a2a2a",
                          marginBottom: 8,
                          animation: "pulse 1.5s infinite",
                        }}
                      ></div>

                      <div
                        style={{
                          width: 50,
                          height: 10,
                          borderRadius: 6,
                          background: "#2a2a2a",
                          animation: "pulse 1.5s infinite",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              marketCoins.map((item, index) => (
                <div className="market-card" key={index}>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.coin}
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />

                    <div>
                      <h5 className="mb-1 fw-bold">{item.coin}/USDT</h5>

                      <small className="text-secondary-custom">
                        Live Market
                      </small>
                    </div>
                  </div>

                  <div className="text-end">
                    <h6 className="fw-bold mb-1">
                      ${Number(item.price).toLocaleString()}
                    </h6>

                    <span
                      className={`fw-bold ${
                        Number(item.change) >= 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {Number(item.change) >= 0 ? "+" : ""}
                      {Number(item.change).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* ACTIVE BET */}
            {activeBets.length > 0 && (
              <div className="active-bet">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-secondary-custom">
                      Active Prediction
                    </small>

                    <h3 className="fw-bold mt-2">
                      {activeBets[0]?.coin?.toUpperCase()}{" "}
                      {activeBets[0]?.direction === "up" ? "↑" : "↓"}
                    </h3>
                  </div>

                  <div className="text-end">
                    <h3 className="text-success fw-bold">
                      ₦{Number(activeBets[0]?.amount || 0).toLocaleString()}
                    </h3>

                    <small className="text-secondary-custom">
                      x{activeBets[0]?.leverage || 1} leverage
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="top-winner-card">
            <div className="card-label">🏆 TOP WINNER</div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              <div
                className="winner-user"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={getUserImage(leaderboard?.[0])}
                  alt=""
                  className="winner-avatar"
                />

                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontWeight: 700,
                    }}
                  >
                    @{leaderboard?.[0]?.username || "No Winner Yet"}
                  </h4>

                  <small
                    style={{
                      color: "#aaa",
                    }}
                  >
                    Highest winnings
                  </small>
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <h2
                  className="winner-amount"
                  style={{
                    margin: 0,
                  }}
                >
                  ₦{Number(leaderboard?.[0]?.total_won || 0).toLocaleString()}
                </h2>
              </div>
            </div>

            <div
              className="winner-coin"
              style={{
                marginTop: "15px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              🥇 #{leaderboard?.length ? 1 : "-"} Ranked Player
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default FeedCard;
