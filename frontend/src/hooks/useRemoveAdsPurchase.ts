import { useCallback, useEffect, useState } from "react";
import {
  endConnection,
  finishTransaction,
  getProducts,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  type ProductPurchase,
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

        const products = await getProducts({ skus: [REMOVE_ADS_SKU] });
        if (products.length > 0) setProduct(products[0]);

        purchaseUpdated = purchaseUpdatedListener(
          async (purchase: ProductPurchase) => {
            if (purchase.transactionReceipt) {
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
      await requestPurchase({ skus: [REMOVE_ADS_SKU] });
    } catch {
      setPurchasing(false);
    }
  }, [connected]);

  const restore = useCallback(async () => {
    if (!connected) return;
    try {
      setRestoring(true);
      setError(null);
      // Re-request the non-consumable — Play Store returns the existing
      // purchase silently if the user already owns it.
      await requestPurchase({ skus: [REMOVE_ADS_SKU] });
    } catch {
      setRestoring(false);
    }
  }, [connected]);

  const price = product?.localizedPrice ?? "₹99";

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
