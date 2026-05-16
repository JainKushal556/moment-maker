import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getUserProfile, unlockTemplate, getAllTemplateStats, claimDailyReward, claimOneTimeReward, claimReferralReward, getTransactionHistory } from '../services/api';
import { useAuth } from './AuthContext';

let cachedStats = null;
let lastStatsFetchTime = 0;
const STATS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const WalletContext = createContext();

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }) => {
    const { currentUser, isInitializing } = useAuth();
    const [balance, setBalance] = useState(0);
    const [referralCode, setReferralCode] = useState('');
    const [claimedTotal, setClaimedTotal] = useState(0);
    const [pendingTotal, setPendingTotal] = useState(0);
    const [referrals, setReferrals] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [hasMoreTransactions, setHasMoreTransactions] = useState(false);
    const [unlockedTemplates, setUnlockedTemplates] = useState([]);
    const [templatePrices, setTemplatePrices] = useState({});
    const [templateStats, setTemplateStats] = useState({});
    const [streakInfo, setStreakInfo] = useState({ count: 0, claimedDays: [], pending: 0, lastClaim: null, dailyBonus: 0 });
    const [claimedOneTime, setClaimedOneTime] = useState([]);
    const [isReferred, setIsReferred] = useState(false);
    const [hasSharedTemplate, setHasSharedTemplate] = useState(false);
    const [bonusAmounts, setBonusAmounts] = useState({ welcome: 0, refSignup: 0, referral: 0 });
    const [walletLoading, setWalletLoading] = useState(true);
    const loading = isInitializing || walletLoading;
    const [claiming, setClaiming] = useState({});
    const lastClaimTime = useRef(0);

    const refreshWallet = useCallback(async () => {
        setWalletLoading(true);
        try {
            // 1. Fetch public template prices and stats (FOR EVERYONE) with Cache
            let stats = cachedStats;
            if (!stats || Date.now() - lastStatsFetchTime > STATS_CACHE_TTL) {
                stats = await getAllTemplateStats();
                cachedStats = stats;
                lastStatsFetchTime = Date.now();
            }

            const prices = {};
            Object.keys(stats).forEach(id => {
                prices[id] = stats[id].price ?? 100;
            });
            setTemplatePrices(prices);
            setTemplateStats(stats);

            // 2. If logged in, fetch private profile data
            if (currentUser) {
                const profile = await getUserProfile();
                
                // STABILITY LOCK: If we recently claimed something (last 5s), 
                // ignore balance/streak updates from server as they might be stale.
                const isRecentlyUpdated = (Date.now() - lastClaimTime.current) < 5000;
                
                if (!isRecentlyUpdated) {
                    setBalance(profile.wishbits || 0);
                    setStreakInfo({
                        count: profile.streakCount || 0,
                        claimedDays: profile.claimedDays || [],
                        pending: profile.pendingRewards || 0,
                        lastClaim: profile.lastClaimDate,
                        dailyBonus: profile.dailyBonus ?? 0
                    });
                    setClaimedOneTime(profile.claimedOneTime || []);
                    setReferrals(profile.referrals || []);
                } else {
                    console.log("Skipping wallet sync due to recent local update (Stability Lock active)");
                }

                // Always update these as they don't have optimistic counterparts or are less sensitive
                setReferralCode(profile.referralCode || '');
                setClaimedTotal(profile.claimedTotal || 0);
                setPendingTotal(profile.pendingTotal || 0);
                setUnlockedTemplates(profile.unlockedTemplates || []);
                setTransactions(profile.transactions || []);
                setHasMoreTransactions(profile.transactions?.length === 5);
                setIsReferred(profile.isReferred || false);
                setHasSharedTemplate(profile.hasSharedTemplate || false);
                setBonusAmounts({
                    welcome: profile.welcomeBonus ?? 0,
                    refSignup: profile.refSignupBonus ?? 0,
                    referral: profile.referralBonus ?? 0
                });
            }
        } catch (error) {
            console.error("Failed to fetch wallet/template data:", error);
        } finally {
            setWalletLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!isInitializing) {
            refreshWallet();
        }
    }, [refreshWallet, currentUser, isInitializing]); 

    const unlock = async (templateId) => {
        try {
            lastClaimTime.current = Date.now();
            const result = await unlockTemplate(templateId);
            if (result && result.new_balance !== undefined) {
                setBalance(result.new_balance);
            }
            setUnlockedTemplates(prev => [...prev, templateId]);
            refreshTransactions();
            return true;
        } catch (error) {
            console.error("Unlock failed:", error);
            throw error;
        }
    };

    const claimWishbits = async (id) => {
        if (claiming[id]) return { success: false, message: "Already claiming..." };
        
        lastClaimTime.current = Date.now();
        const prevReferrals = [...referrals];
        const prevBalance = balance;
        
        const refIndex = referrals.findIndex(r => r.id === id);
        if (refIndex === -1) return { success: false };

        const rewardAmount = referrals[refIndex].wishbits || 50;
        
        const newReferrals = [...referrals];
        newReferrals[refIndex] = { ...newReferrals[refIndex], status: 'claimed' };
        
        setReferrals(newReferrals);
        setBalance(prev => prev + rewardAmount);
        setClaiming(prev => ({ ...prev, [id]: true }));

        try {
            const result = await claimReferralReward(id);
            if (result && result.new_balance !== undefined) {
                setBalance(result.new_balance);
            }
            refreshTransactions();
            return { success: true };
        } catch (error) {
            setReferrals(prevReferrals);
            setBalance(prevBalance);
            console.error("Referral claim failed:", error);
            return { success: false, message: error.message };
        } finally {
            setClaiming(prev => ({ ...prev, [id]: false }));
        }
    };

    const claimDaily = async (day) => {
        const claimId = `daily-${day}`;
        if (claiming[claimId]) return;

        lastClaimTime.current = Date.now();
        const prevStreak = { ...streakInfo };
        const prevBalance = balance;
        
        const isBonusDay = day === 7;
        const rewardAmount = isBonusDay ? (streakInfo.dailyBonus * 2) : streakInfo.dailyBonus;

        setBalance(prev => prev + rewardAmount);
        setStreakInfo(prev => ({
            ...prev,
            claimedDays: [...prev.claimedDays, day]
        }));
        setClaiming(prev => ({ ...prev, [claimId]: true }));

        try {
            const result = await claimDailyReward(day);
            setBalance(result.new_balance);
            setStreakInfo(prev => ({
                ...prev,
                count: result.streak,
                claimedDays: result.claimedDays
            }));
            refreshTransactions();
        } catch (error) {
            setBalance(prevBalance);
            setStreakInfo(prevStreak);
            console.error("Daily claim failed:", error);
            throw error;
        } finally {
            setClaiming(prev => ({ ...prev, [claimId]: false }));
        }
    };

    const claimOneTime = async (type) => {
        if (claiming[type]) return;

        lastClaimTime.current = Date.now();
        const prevClaimed = [...claimedOneTime];
        const prevBalance = balance;
        
        let rewardAmount = 0;
        if (type === 'WELCOME_BONUS') rewardAmount = bonusAmounts.welcome;
        else if (type === 'REFERRAL_SIGNUP') rewardAmount = bonusAmounts.refSignup;

        setClaimedOneTime(prev => [...prev, type]);
        setBalance(prev => prev + rewardAmount);
        setClaiming(prev => ({ ...prev, [type]: true }));

        try {
            const result = await claimOneTimeReward(type);
            setBalance(result.new_balance);
            setClaimedOneTime(result.claimedOneTime);
            refreshTransactions();
            return { success: true };
        } catch (error) {
            setClaimedOneTime(prevClaimed);
            setBalance(prevBalance);
            console.error("One-time claim failed:", error);
            return { success: false, message: error.message };
        } finally {
            setClaiming(prev => ({ ...prev, [type]: false }));
        }
    };

    const refreshTransactions = async () => {
        try {
            const res = await getTransactionHistory(5);
            if (res && res.transactions) {
                setTransactions(res.transactions);
                setHasMoreTransactions(res.hasMore);
            }
        } catch (error) {
            console.error("Failed to refresh transactions:", error);
        }
    };

    const loadMoreTransactions = async () => {
        if (!hasMoreTransactions || loading) return;
        const lastTx = transactions[transactions.length - 1];
        if (!lastTx) return;

        try {
            const res = await getTransactionHistory(5, lastTx.id);
            if (res && res.transactions) {
                setTransactions(prev => [...prev, ...res.transactions]);
                setHasMoreTransactions(res.hasMore);
            }
        } catch (error) {
            console.error("Failed to load more transactions:", error);
        }
    };

    const value = {
        balance,
        referralCode,
        referrals,
        transactions,
        unlockedTemplates,
        templatePrices,
        templateStats,
        claimedTotal,
        pendingTotal,
        streakInfo,
        claimedOneTime,
        claiming,
        isReferred,
        hasSharedTemplate,
        bonusAmounts,
        claimWishbits,
        claimDaily,
        claimOneTime,
        refreshWallet,
        unlock,
        loading,
        loadMoreTransactions,
        hasMoreTransactions
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};
