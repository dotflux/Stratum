import { useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { useUser } from "../Home";
import HomeBg from "../HomeBg";

interface OutletContextType {
  isExpanded: boolean;
}

type TierKey = "free" | "pro" | "elite";

const Billing = () => {
  const { isExpanded } = useOutletContext<OutletContextType>();
  const { user } = useUser();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const tiers: {
    key: TierKey;
    name: string;
    price: number;
    benefits: string[];
  }[] = [
    {
      key: "free",
      name: "Free",
      price: 0,
      benefits: ["1 workspace", "Up to 3 members", "Max 10Mb file upload"],
    },
    {
      key: "pro",
      name: "Pro",
      price: 5000,
      benefits: [
        "Up to 5 workspaces",
        "Up to 10 members",
        "Max 25mb file upload",
      ],
    },
    {
      key: "elite",
      name: "Elite",
      price: 10000,
      benefits: [
        "Unlimited workspaces",
        "Unlimited members",
        "Max file upload 100mb",
      ],
    },
  ];

  const tierRank: Record<TierKey, number> = { free: 1, pro: 2, elite: 3 };

  const purchaseTier = async (tierKey: string) => {
    try {
      setLoadingTier(tierKey);
      const res = await axios.post(
        "http://localhost:3000/home/billing",
        { tier: tierKey },
        { withCredentials: true }
      );
      if (res.data.valid) {
        setLoadingTier(null);
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
        setLoadingTier(null);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      <HomeBg />
      <div
        className={`relative transition-all duration-300 overflow-x-hidden ${
          isExpanded ? "lg:ml-64 lg:w-[calc(100%-16rem)]" : "w-full"
        } z-10`}
      >
        <div className="w-full px-4 md:px-0 mt-10 mb-12">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 px-6">
              <h1 className="text-3xl font-bold text-white">Billing</h1>
              <div className="text-right">
                <span className="block text-gray-400 text-sm">
                  Your Balance
                </span>
                <span className="text-2xl font-semibold text-white">
                  {user?.strats} Strats
                </span>
              </div>
            </div>

            {/* Tier Cards */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-stretch px-6">
              {tiers.map((tier) => {
                const currentTier: TierKey = (user?.tier as TierKey) || "free";
                const isOwnedOrLower =
                  tierRank[tier.key] <= tierRank[currentTier];
                const isCurrent = user?.tier === tier.key;

                return (
                  <div
                    key={tier.key}
                    className="flex flex-col justify-between h-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 text-white shadow-lg transform transition hover:scale-105"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                      <p className="text-xl font-semibold mb-4">
                        {tier.price} Strats
                      </p>
                      <ul className="mb-6 space-y-1 text-gray-300 text-sm">
                        {tier.benefits.map((b) => (
                          <li key={b}>&bull; {b}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => purchaseTier(tier.key)}
                      disabled={isOwnedOrLower || loadingTier === tier.key}
                      className={`w-full py-2 rounded-full font-semibold ${
                        isOwnedOrLower
                          ? "bg-gray-600 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-500"
                      } transition disabled:opacity-50`}
                    >
                      {isOwnedOrLower
                        ? "Owned"
                        : loadingTier === tier.key
                        ? "Processing…"
                        : "Buy"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
