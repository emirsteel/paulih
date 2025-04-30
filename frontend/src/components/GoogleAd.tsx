// src/components/GoogleAd.tsx
import React, { useEffect, useRef } from "react";

interface GoogleAdProps {
  uniqueKey: string;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ uniqueKey }) => {
  const adRef = useRef<HTMLModElement>(null); // React, <ins> için HTMLModElement kullanıyor

  useEffect(() => {
    if (adRef.current) {
      if (!adRef.current.getAttribute("data-adsbygoogle-status")) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("Adsense error", e);
        }
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      key={uniqueKey}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-4386980014525432"
      data-ad-slot="6898470904"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default GoogleAd;
