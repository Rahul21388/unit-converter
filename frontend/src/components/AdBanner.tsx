import React from "react";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const AD_UNIT_ID = "ca-app-pub-9942161594730475/5341904705";

interface Props {
  hidden?: boolean;
}

export default function AdBanner({ hidden }: Props) {
  if (hidden) return null;
  return (
    <BannerAd
      unitId={AD_UNIT_ID}
      size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: false }}
    />
  );
}
