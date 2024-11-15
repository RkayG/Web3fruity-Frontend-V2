// ParentBanner.js
import Banner from "./banner";

const ParentComponent = () => {
  const texts = [
    /* "One platform, numerous opportunities",
    "All the ways to earn in web3", */
    "Claim Free Crypto: The Ultimate Guide to Airdrops",
    "Play, Earn, Repeat: Discover Top Play-to-Earn Games",
    "Knowledge is Power: Your Crypto Learning Journey",
    "Farm, Harvest, Profit: Ultimate Defi Farming Hub"
    /* "From Apps to Assets: Earn Crypto on the Go" */
  ];

  return (
    <div>
      <Banner bannerTexts={texts} />
    </div>
  );
};

export default ParentComponent;
