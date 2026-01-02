import { BentoGrid } from './components/BentoGrid';
import { ChatWidget } from './components/ChatWidget';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <main className="main-content">
        <BentoGrid />
      </main>
      
      <Footer />
      
      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
