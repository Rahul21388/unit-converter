import { useCallback, useEffect, useState } from "react";
import {
  endConnection,
  fetchProducts,
  finishTransaction,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  type Purchase,
  type PurchaseError,
  type Product,
} from "react-native-iap";
import { useAdsRemoved } from "./useAdsRemoved";

export const REMOVE_ADS_SKU = "remove_ads";

export function useRemoveAdsPurchase() {
  const { adsRemoved, loaded, removeAds, restoreAds } = useAdsRemoved();
  const [product, setProduct] = useState<Product | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let purchaseUpdated: ReturnType<typeof purchaseUpdatedListener>;
    let purchaseError: ReturnType<typeof purchaseErrorListener>;

    const setup = async () => {
      try {
        await initConnection();
        setConnected(true);

        // v15 API: fetchProducts replaces getProducts
        const products = await fetchProducts({
          skus: [REMOVE_ADS_SKU],
          type: "in-app",
        });
        if (products && products.length > 0) setProduct(products[0] as Product);

        purchaseUpdated = purchaseUpdatedListener(
          async (purchase: Purchase) => {
            if (purchase.purchaseState === "purchased") {
              await finishTransaction({ purchase, isConsumable: false });
              await removeAds();
            }
            setPurchasing(false);
            setRestoring(false);
          },
        );

        purchaseError = purchaseErrorListener((err: PurchaseError) => {
          if ((err as any).code !== "E_USER_CANCELLED") {
            setError(err.message ?? "Purchase failed");
          }
          setPurchasing(false);
          setRestoring(false);
        });
      } catch {
        setConnected(false);
      }
    };

    setup();

    return () => {
      purchaseUpdated?.remove();
      purchaseError?.remove();
      endConnection();
    };
  }, [removeAds]);

  const purchase = useCallback(async () => {
    if (!connected) return;
    try {
      setPurchasing(true);
      setError(null);
      // v15 API: nested request structure required
      await requestPurchase({
        type: "in-app",
        request: {
          google: { skus: [REMOVE_ADS_SKU] },
        },
      });
    } catch {
      setPurchasing(false);
    }
  }, [connected]);

  const restore = useCallback(async () => {
    if (!connected) return;
    try {
      setRestoring(true);
      setError(null);
      await requestPurchase({
        type: "in-app",
        request: {
          google: { skus: [REMOVE_ADS_SKU] },
        },
      });
    } catch {
      setRestoring(false);
    }
  }, [connected]);

  const price = (product as any)?.displayPrice ?? "₹99";

  return {
    adsRemoved,
    loaded,
    product,
    price,
    connected,
    purchasing,
    restoring,
    error,
    purchase,
    restore,
    removeAds,
    restoreAds,
  };
}
