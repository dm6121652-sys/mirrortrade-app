import { apiClient } from './client';

interface CompleteOnboardingPayload {
  maxRiskPerTrade: number;
  maxDailyLoss: number;
}

export const onboardingApi = {
  // Save risk profile settings and mark onboarding as complete
  complete: async (payload: CompleteOnboardingPayload) => {
    // 1. Save the trading profile settings
    await apiClient.patch('/trading-profile', {
      copyTradingEnabled: true,
      killSwitchEnabled: true,
      maxRiskPerTrade: payload.maxRiskPerTrade / 100,
      maxDailyLoss: payload.maxDailyLoss / 100,
      maxOpenPositions: 5,
      allowedSymbols: [],
    });

    // 2. Mark onboarding as complete on user record
    await apiClient.patch('/users/me/complete-onboarding');
  },
};
