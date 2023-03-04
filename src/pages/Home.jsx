import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

import './Home.css'

function HomePage() {
  return (
    <div className="home">
      <div className="container">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  );
}
export default HomePage;
