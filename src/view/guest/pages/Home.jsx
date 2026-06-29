import React, { useEffect, useState } from "react";
import "../../../assets/css/home.css";
import { Link } from "react-router-dom";
import ApiUrl from "../../../constants/ApiUrl";

import FetchCard from "../../../components/FeedCard";
import { useAuth } from "../../../contexts/AuthContext";

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

function Home() {
  const { user, token } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [coins, setCoins] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeBets, setActiveBets] = useState([]);
  const [wallet, setWallet] = useState(0);

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

  // ================= LOAD =================

  // useEffect(() => {
  //   fetchCoins();
  //   fetchFeed();
  //   fetchHomeFeed();
  //   fetchLeaderboard();
  //   fetchTotalPayout();

  //   if (token) {
  //     fetchMe();
  //     fetchWallet();
  //     fetchActiveBets();
  //   }

  //   const interval = setInterval(() => {
  //     fetchCoins();

  //     if (token) {
  //       fetchWallet();
  //       fetchActiveBets();
  //       fetchFeed();
  //     }
  //   }, 60000);

  //   return () => clearInterval(interval);
  // }, [token]);

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
        }, 200);
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

  // if (pageLoading) {
  //   return (
  //     <div className="home-loader">
  //       <div className="loader-content">
  //         <div className="crypto-spinner">₿</div>

  //         <h2>Stakeova</h2>

  //         <p>Loading live markets...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* ================= LIVE TICKER ================= */}
      <div className="live-ticker">
        <div className="ticker-track">
          {tickerCoins.concat(tickerCoins).map((item, index) => (
            <div className="ticker-item" key={index}>
              🔥{item.coin}{" "}
              <span>
                {Number(item.change) >= 0 ? "+" : ""}
                {Number(item.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="live-rail-section">
        <div className="live-rail-track">
          {activities.concat(activities).map((item, index) => (
            <div className="rail-card" key={index}>
              <img
                src={getFeedUserImage(item)}
                alt={item.username}
                className="rail-avatar"
              />

              <div className="rail-content">
                <span className="rail-text">
                  <strong>{item.username}</strong>

                  {item.result === "win" || item.result === "creator_win"
                    ? ` won ₦${Number(item.amount).toLocaleString()} predicting `
                    : ` lost ₦${Number(item.amount).toLocaleString()} predicting `}

                  <strong>{item.coin?.toUpperCase()}</strong>
                </span>
              </div>

              <span
                className={`rail-status ${
                  item.result === "win" || item.result === "creator_win"
                    ? "win"
                    : "loss"
                }`}
              >
                {item.result === "win" || item.result === "creator_win"
                  ? "WIN"
                  : "LOSS"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="hero-banner">
        <div className="hero-overlay"></div>

        <div className="container hero-banner-content">
          <div className="hero-banner-badge">
            🔥 Live Crypto Prediction Market
          </div>

          <h1>
            Predict The Next Move.
            <br />
            <span>Win Real Rewards.</span>
          </h1>

          <p>
            Join thousands of traders competing on Bitcoin, Ethereum, Solana and
            more in real-time prediction markets.
          </p>

          <div className="hero-banner-actions">
            <a
              href="https://play.google.com/store/apps/details?id=com.lyli.stakeova"
              className="btn btn-success btn-lg"
            >
              🚀 Launch App
            </a>

            <button className="btn btn-outline-light btn-lg">
              <a
                href="https://play.google.com/store/apps/details?id=com.lyli.stakeova"
                className="btn btn-success btn-lg"
              >
                📈 Explore Markets
              </a>
            </button>
          </div>
        </div>
      </section>

      <FetchCard />

      {/* ================= FEATURES ================= */}
      <section className="features-section py-3">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">
              Why Traders Love
              <span> Stakeova</span>
            </h2>

            <p className="section-text">
              Built for speed, precision, and real-time market action.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">💰</div>

                <h4>Instant Deposits</h4>

                <p>
                  Fund your wallet instantly and start predicting in seconds.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">📈</div>

                <h4>Live Predictions</h4>

                <p>Predict real-time market movements with active traders.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🔒</div>

                <h4>Secure Platform</h4>

                <p>Protected transactions and secure wallet systems.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIVE ACTIVITY ================= */}
      <section className="activity-section py-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Live Activity</h2>
          </div>

          {activities.length === 0 ? (
            <div className="activity-card">
              <div className="d-flex align-items-center gap-3">
                <div className="live-dot"></div>

                <p className="mb-0 fw-semibold">No live activity yet</p>
              </div>

              <small className="text-secondary-custom">
                waiting for players...
              </small>
            </div>
          ) : (
            <div className="terminal-feed">
              <div className="terminal-feed-track">
                {activities
                  .concat(activities)
                  .concat(activities)
                  .map((item, index) => (
                    <div className="terminal-row" key={index}>
                      <div className="activity-user">
                        <img
                          src={getFeedUserImage(item)}
                          alt={item.username}
                          className="activity-avatar"
                        />

                        <span className="activity-text">
                          <strong>{item.username}</strong>

                          {item.result === "win" ||
                          item.result === "creator_win"
                            ? " won "
                            : " lost "}

                          <strong>
                            ₦{Number(item.amount).toLocaleString()}
                          </strong>

                          {" on "}

                          <strong>{item.coin?.toUpperCase()}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section pt-5">
        <div className="cta-card">
          <div className="cta-badge">🚀 Join other Active Predictors</div>

          <h2 className="cta-title">
            Predict Market Moves.
            <span> Earn Real Rewards.</span>
          </h2>

          <p className="cta-text">
            Create predictions on BTC, ETH, SOL and win big. Compete with
            traders, climb the leaderboard and win rewards.
          </p>

          <div className="cta-actions">
            <button className="btn btn-success btn-lg">
              <a
                style={{ textDecoration: "none", color: "white" }}
                href="register"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Started
              </a>
            </button>
          </div>
        </div>
      </section>

      <button className="floating-launch-btn">
        <a
          style={{ textDecoration: "none", color: "white" }}
          href="https://play.google.com/store/apps/details?id=com.lyli.stakeova"
          target="_blank"
          rel="noopener noreferrer"
        >
          Launch App
        </a>
      </button>
    </div>
  );
}

export default Home;
