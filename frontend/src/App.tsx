// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ItemListPage } from "./pages/ItemListPage";
import { ItemDetailPage } from "./pages/ItemDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ItemListPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
