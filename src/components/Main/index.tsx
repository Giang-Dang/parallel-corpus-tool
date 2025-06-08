import Header from './Header';
import Popups from './Popups';
import RibbonMenu from './RibbonMenu';
import DataTable from './DataTable';
import WelcomeSection from './WelcomeSection';

export default function Main() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <RibbonMenu />
      <WelcomeSection />
      <DataTable />
      <Popups />
    </div>
  );
}
