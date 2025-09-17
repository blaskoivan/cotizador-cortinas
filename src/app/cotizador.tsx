import React from 'react';
import dynamic from 'next/dynamic';
// Importa tu componente de forma dinámica para evitar issues SSR si usas librerías que dependan de estdo del cliente
const CotizadorCortinasElectricas = dynamic(
  () => import('../components/Cotizador'),
  { ssr: false }
);
const CotizadorPage = () => {
  return (
    <div>
      <CotizadorCortinasElectricas />
    </div>
  );
};
export default CotizadorPage;