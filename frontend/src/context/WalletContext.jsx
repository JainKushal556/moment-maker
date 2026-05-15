import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getUserProfile, unlockTemplate, getAllTemplateStats, claimDailyReward, claimOneTimeReward, claimReferralReward } from '../services/api';
import { useAuth } from './AuthContext';

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
    const [unlockedTemplates, setUnlockedTemplates] = useState([]);
    const [templatePrices, setTemplatePrices] = useState({});
    const [streakInfo, setStreakInfo] = useState({ count: 0, claimedDays: [], pending: 0, lastClaim: null, dailyBonus: 5 });
    const [claimedOneTime, setClaimedOneTime] = useState([]);
    const [isReferred, setIsReferred] = useState(false);
    const [hasSharedTemplate, setHasSharedTemplate] = useState(false);
    const [bonusAmounts, setBonusAmounts] = useState({ welcome: 10, refSignup: 20, referral: 50 });
    const [loading, setLoading] = useState(false);
    const [claiming, setClaiming] = useState({});
    const lastClaimTime = useRef(0);

    const refreshWallet = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch public template prices (FOR EVERYONE)
            const stats = await getAllTemplateStats();
            const prices = {};
            Object.keys(stats).forEach(id => {
                prices[id] = stats[id].price ?? 100;
            });
            setTemplatePrices(prices);

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
                        dailyBonus: profile.dailyBonus || 5
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
                setIsReferred(profile.isReferred || false);
                setHasSharedTemplate(profile.hasSharedTemplate || false);
                setBonusAmounts({
                    welcome: profile.welcomeBonus || 10,
                    refSignup: profile.refSignupBonus || 20,
                    referral: profile.referralBonus || 50
                });
            }
        } catch (error) {
            console.error("Failed to fetch wallet/template data:", error);
        } finally {
            setLoading(false);
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

    const value = {
        balance,
        referralCode,
        referrals,
        transactions,
        unlockedTemplates,
        templatePrices,
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
        loading
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};
