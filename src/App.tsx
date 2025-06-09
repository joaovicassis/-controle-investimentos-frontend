import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CadastroInvestimento from './pages/CadastroInvestimento';
import ListagemInvestimentos from './pages/ListagemInvestimentos';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ListagemInvestimentos />} />
            <Route path="/cadastro" element={<CadastroInvestimento />} />
            <Route path="/editar/:id" element={<CadastroInvestimento />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
