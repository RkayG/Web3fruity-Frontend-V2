// INTERNAL IMPORTS 
import ParentComponent from 'components/parent-banner';
import FeaturedEvent from 'components/featured';
import Airdrops from 'components/airdrop-card';
import TokenFarming from 'components/token-farming-card';
import Games from 'components/parent-games-card';
import RewardForTask from 'components/reward-task-card';
import CryptoNews from 'components/crypto-news-card';
import AcademySection from 'components/academy-card';
import Disclaimer from 'components/disclaimer';
import BottomSubscribe from 'components/bottom-subscribe';

export default function Page() {
    return (
        <main className="">
            <ParentComponent />
            <FeaturedEvent />
            <Airdrops />
            <TokenFarming />
            <Games />
            <RewardForTask />
            <CryptoNews />
            <AcademySection />
            <Disclaimer />
            <BottomSubscribe />
        </main>
    );
}

