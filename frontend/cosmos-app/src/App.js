import './App.css';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import OrderManagement from './components/order-management.tsx';
import CustomerManagement from './components/customer-management.tsx';
import InventoryManagement from './components/inventory-management.tsx';


function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <nav>
            <Navigation nav={"Order Management"} url={"/order-management"}></Navigation>
            <Navigation nav={"Customer Management"} url={"/customer-management"}></Navigation>
            <Navigation nav={"Inventory Management"} url={"/inventory-management"}></Navigation>
          </nav>
        </div>

        <Routes>
          <Route path="/order-management" element={<OrderManagement/>}></Route>
          <Route path="/customer-management" element={<CustomerManagement/>}></Route>
          <Route path="/inventory-management" element={<InventoryManagement/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

function Navigation({nav, url}) {
  return (
    <li>
      <Link to={ url }>{ nav }</Link>
    </li>
  )
}

export default App;
