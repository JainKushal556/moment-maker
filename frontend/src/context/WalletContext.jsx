import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile, unlockTemplate } from '../services/api';
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
    const { currentUser } = useAuth();
    const [balance, setBalance] = useState(0);
    const [referralCode, setReferralCode] = useState('');
    const [claimedTotal, setClaimedTotal] = useState(0);
    const [pendingTotal, setPendingTotal] = useState(0);
    const [referrals, setReferrals] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [unlockedTemplates, setUnlockedTemplates] = useState([]);
    const [templatePrices, setTemplatePrices] = useState({});
    const [loading, setLoading] = useState(false);

    const refreshWallet = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const profile = await getUserProfile();
            setBalance(profile.wishbits);
            setReferralCode(profile.referralCode);
            setReferrals(profile.referrals || []);
            setClaimedTotal(profile.claimedTotal || 0);
            setPendingTotal(profile.pendingTotal || 0);
            setUnlockedTemplates(profile.unlockedTemplates || []);
            setTemplatePrices(profile.templatePrices || {});
            setTransactions(profile.transactions || []);
        } catch (error) {
            console.error("Failed to fetch wallet data:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        refreshWallet();
    }, [refreshWallet]);

    const unlock = async (templateId) => {
        try {
            await unlockTemplate(templateId);
            await refreshWallet();
            return true;
        } catch (error) {
            console.error("Unlock failed:", error);
            throw error;
        }
    };

    const claimWishbits = (id) => {
        // This will be implemented in a future phase (Backend Reward Claiming)
        console.log("Claiming wishbits for referral:", id);
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
        claimWishbits,
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
