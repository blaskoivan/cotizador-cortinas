import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calculator, Trash2, FileText, Download, Mail, Plus } from 'lucide-react';

interface QuotationItem {
  id: string;
  category: string;
  product: string;
  measurement?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ProductPrices {
  [key: string]: {
    [key: string]: number;
  };
}

const CotizadorCortinasElectricas = () => {
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [quotationNumber, setQuotationNumber] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);

  // Category selections
  const [tablillas, setTablillas] = useState({ product: '', quantity: 1 });
  const [guias, setGuias] = useState({ product: '', measurement: '', quantity: 1 });
  const [angulos, setAngulos] = useState({ product: '', measurement: '', quantity: 1 });
  const [tubos, setTubos] = useState({ product: '', measurement: '', quantity: 1 });
  const [armado, setArmado] = useState(false);         // Cambiado a booleano
  const [instalacion, setInstalacion] = useState(false); // Cambiado a booleano

  // Product prices configuration
  const productPrices: ProductPrices = {
    tablillas: {
      'Galvanizada Ciega Liviana': 45,
      'Galvanizada Microperforada Liviana': 48,
      'Galvanizada Ciega Reforzada': 55,
      'Galvanizada Microperforada Reforzada': 58
    },
    guias: {
      '20x40-2.5': 25, '20x40-3': 28, '20x40-3.5': 32, '20x40-4': 35, '20x40-4.5': 38, '20x40-6': 45,
      '20x50-2.5': 30, '20x50-3': 33, '20x50-3.5': 37, '20x50-4': 40, '20x50-4.5': 43, '20x50-6': 50,
      '20x60-2.5': 35, '20x60-3': 38, '20x60-3.5': 42, '20x60-4': 45, '20x60-4.5': 48, '20x60-6': 55,
      '20x80-2.5': 45, '20x80-3': 48, '20x80-3.5': 52, '20x80-4': 55, '20x80-4.5': 58, '20x80-6': 65,
      '20x100-2.5': 55, '20x100-3': 58, '20x100-3.5': 62, '20x100-4': 65, '20x100-4.5': 68, '20x100-6': 75,
      '50x70-2.5': 65, '50x70-3': 68, '50x70-3.5': 72, '50x70-4': 75, '50x70-4.5': 78, '50x70-6': 85,
      '50x100-2.5': 85, '50x100-3': 88, '50x100-3.5': 92, '50x100-4': 95, '50x100-4.5': 98, '50x100-6': 105
    },
    angulos: {
      'Galvanizada 32mm-2.5': 18, 'Galvanizada 32mm-3': 20, 'Galvanizada 32mm-3.5': 22, 'Galvanizada 32mm-4': 24, 'Galvanizada 32mm-4.5': 26,
      'Decapado 32mm-2.5': 22, 'Decapado 32mm-3': 24, 'Decapado 32mm-3.5': 26, 'Decapado 32mm-4': 28, 'Decapado 32mm-4.5': 30, 'Decapado 32mm-6': 35
    },
    tubos: {
      'Redondo 100mm-3': 120, 'Redondo 100mm-4': 135, 'Redondo 100mm-6': 165,
      'Octogonal 130mm-3.5': 155, 'Octogonal 130mm-4': 170, 'Octogonal 130mm-4.5': 185, 'Octogonal 130mm-5': 200, 'Octogonal 130mm-6': 230,
      'Octogonal 160mm-3.5': 185, 'Octogonal 160mm-4': 200, 'Octogonal 160mm-4.5': 215, 'Octogonal 160mm-5': 230, 'Octogonal 160mm-6': 260,
      'Octogonal 180mm-3.5': 215, 'Octogonal 180mm-4': 230, 'Octogonal 180mm-4.5': 245, 'Octogonal 180mm-5': 260, 'Octogonal 180mm-6': 290,
      'Octogonal 210mm-3.5': 245, 'Octogonal 210mm-4': 260, 'Octogonal 210mm-4.5': 275, 'Octogonal 210mm-5': 290, 'Octogonal 210mm-6': 320
    },
    manoDeObra: {
      'Armado': 150,
      'Instalación': 200
    }
  };

  const categories = {
    tablillas: 'Tablillas',
    guias: 'Guías',
    angulos: 'Ángulos',
    tubos: 'Tubos',
    manoDeObra: 'Mano de Obra'
  };

  const getProductsByCategory = (category: string) => {
    switch (category) {
      case 'tablillas':
        return Object.keys(productPrices.tablillas);
      case 'guias':
        return ['20x40', '20x50', '20x60', '20x80', '20x100', '50x70', '50x100'];
      case 'angulos':
        return ['Galvanizada 32mm', 'Decapado 32mm'];
      case 'tubos':
        return ['Redondo 100mm', 'Octogonal 130mm', 'Octogonal 160mm', 'Octogonal 180mm', 'Octogonal 210mm'];
      case 'manoDeObra':
        return Object.keys(productPrices.manoDeObra);
      default:
        return [];
    }
  };

  const getMeasurementsByProduct = (category: string, product: string) => {
    switch (category) {
      case 'guias':
        return ['2.5', '3', '3.5', '4', '4.5', '6'];
      case 'angulos':
        if (product === 'Galvanizada 32mm') return ['2.5', '3', '3.5', '4', '4.5'];
        if (product === 'Decapado 32mm') return ['2.5', '3', '3.5', '4', '4.5', '6'];
        return [];
      case 'tubos':
        if (product === 'Redondo 100mm') return ['3', '4', '6'];
        return ['3.5', '4', '4.5', '5', '6'];
      default:
        return [];
    }
  };

  const getUnitPrice = (category: string, product: string, measurement?: string) => {
    const categoryPrices = productPrices[category];
    if (!categoryPrices) return 0;

    if (category === 'tablillas' || category === 'manoDeObra') {
      return categoryPrices[product] || 0;
    }

    const key = measurement ? `${product}-${measurement}` : product;
    return categoryPrices[key] || 0;
  };

  const addItemToQuotation = (category: string, product: string, measurement: string | undefined, quantity: number) => {
    if (!product || quantity <= 0) return;

    const unitPrice = getUnitPrice(category, product, measurement);
    const total = unitPrice * quantity;

    const newItem: QuotationItem = {
      id: `${category}-${Date.now()}`,
      category: categories[category as keyof typeof categories],
      product: product,
      measurement: measurement || undefined,
      quantity,
      unitPrice,
      total
    };

    setQuotationItems(prev => [...prev, newItem]);
  };

  const generateCompleteQuotation = () => {
    const newItems: QuotationItem[] = [];

    // Add Tablillas
    if (tablillas.product && tablillas.quantity > 0) {
      const unitPrice = getUnitPrice('tablillas', tablillas.product);
      newItems.push({
        id: `tablillas-${Date.now()}`,
        category: 'Tablillas',
        product: tablillas.product,
        quantity: tablillas.quantity,
        unitPrice,
        total: unitPrice * tablillas.quantity
      });
    }

    // Add Guías
    if (guias.product && guias.measurement && guias.quantity > 0) {
      const unitPrice = getUnitPrice('guias', guias.product, guias.measurement);
      newItems.push({
        id: `guias-${Date.now()}`,
        category: 'Guías',
        product: guias.product,
        measurement: guias.measurement,
        quantity: guias.quantity,
        unitPrice,
        total: unitPrice * guias.quantity
      });
    }

    // Add Ángulos
    if (angulos.product && angulos.measurement && angulos.quantity > 0) {
      const unitPrice = getUnitPrice('angulos', angulos.product, angulos.measurement);
      newItems.push({
        id: `angulos-${Date.now()}`,
        category: 'Ángulos',
        product: angulos.product,
        measurement: angulos.measurement,
        quantity: angulos.quantity,
        unitPrice,
        total: unitPrice * angulos.quantity
      });
    }

    // Add Tubos
    if (tubos.product && tubos.measurement && tubos.quantity > 0) {
      const unitPrice = getUnitPrice('tubos', tubos.product, tubos.measurement);
      newItems.push({
        id: `tubos-${Date.now()}`,
        category: 'Tubos',
        product: tubos.product,
        measurement: tubos.measurement,
        quantity: tubos.quantity,
        unitPrice,
        total: unitPrice * tubos.quantity
      });
    }

    // Add Armado (checkbox)
    if (armado) {
      const unitPrice = getUnitPrice('manoDeObra', 'Armado');
      newItems.push({
        id: `armado-${Date.now()}`,
        category: 'Mano de Obra',
        product: 'Armado',
        quantity: 1,
        unitPrice,
        total: unitPrice
      });
    }

    // Add Instalación (checkbox)
    if (instalacion) {
      const unitPrice = getUnitPrice('manoDeObra', 'Instalación');
      newItems.push({
        id: `instalacion-${Date.now()}`,
        category: 'Mano de Obra',
        product: 'Instalación',
        quantity: 1,
        unitPrice,
        total: unitPrice
      });
    }

    setQuotationItems(newItems);
  };

  const removeFromQuotation = (id: string) => {
    setQuotationItems(quotationItems.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return quotationItems.reduce((sum, item) => sum + item.total, 0);
  };

  const generateQuotationNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setQuotationNumber(`COT-${year}${month}${day}-${random}`);
  };

  const exportQuotation = () => {
    const quotationData = {
      quotationNumber,
      client: { name: clientName, email: clientEmail },
      items: quotationItems,
      total: getTotalAmount(),
      date: new Date().toLocaleDateString('es-ES')
    };

    const dataStr = JSON.stringify(quotationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cotizacion-${quotationNumber}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const sendEmailQuotation = async () => {
    if (!clientEmail || quotationItems.length === 0) {
      alert('Por favor, ingrese un email válido y asegúrese de tener productos en la cotización.');
      return;
    }

    setIsEmailSending(true);

    try {
      const quotationHTML = generateEmailHTML();
      
      const emailData = {
        to_email: clientEmail,
        to_name: clientName,
        subject: `Cotización ${quotationNumber} - Cortinas Eléctricas`,
        html_message: quotationHTML,
        quotation_number: quotationNumber,
        total_amount: getTotalAmount().toLocaleString()
      };

      setTimeout(() => {
        alert(`Cotización enviada exitosamente a ${clientEmail}`);
        setIsEmailSending(false);
      }, 2000);

    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error al enviar el email. Por favor, intente nuevamente.');
      setIsEmailSending(false);
    }
  };

  const generateEmailHTML = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333;">Cotización de Cortinas Eléctricas</h1>
          <p style="color: #666;">Número: ${quotationNumber}</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #333;">Estimado/a ${clientName},</h2>
          <p>Adjunto encontrará su cotización detallada:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Producto</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cantidad</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Precio Unit.</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${quotationItems.map(item => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    ${item.product}<br>
                    <small style="color: #666;">${item.category}${item.measurement ? ` - ${item.measurement}m` : ''}</small>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.unitPrice.toLocaleString()}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">${item.total.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f8f9fa;">
                <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">TOTAL:</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold; font-size: 1.2em;">${getTotalAmount().toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <p style="color: #666; font-size: 0.9em;">
            Esta cotización tiene validez de 30 días desde la fecha de emisión.<br>
            Los precios están sujetos a cambios sin previo aviso.
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 0.9em;">
          <p>Gracias por su confianza en nuestros productos.</p>
          <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    generateQuotationNumber();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Cotizador de Cortinas</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Product Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Nombre del Cliente</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ingrese el nombre del cliente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>
                <div>
                  <Label>Número de Cotización</Label>
                  <div className="flex gap-2">
                    <Input value={quotationNumber} readOnly className="bg-muted" />
                    <Button variant="outline" onClick={generateQuotationNumber}>
                      Generar Nuevo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Selection - All Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Seleccionar Elementos
                </CardTitle>

              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tablillas */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-semibold mb-3 text-primary">Tablillas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Tipo de Tablilla</Label>
                      <Select value={tablillas.product} onValueChange={(value) => setTablillas({...tablillas, product: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(productPrices.tablillas).map(product => (
                            <SelectItem key={product} value={product}>{product}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Metros Cuadrados</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={tablillas.quantity}
                        onChange={(e) => setTablillas({...tablillas, quantity: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label>Precio</Label>
                      <Input 
                        value={tablillas.product ? `${(getUnitPrice('tablillas', tablillas.product) * tablillas.quantity).toLocaleString()}` : '$0'}
                        readOnly 
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                {/* Guías */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-semibold mb-3 text-primary">Guías</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Tipo de Guía</Label>
                      <Select value={guias.product} onValueChange={(value) => setGuias({...guias, product: value, measurement: ''})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {['20x40', '20x50', '20x60', '20x80', '20x100', '50x70', '50x100'].map(product => (
                            <SelectItem key={product} value={product}>{product}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Medida</Label>
                      <Select value={guias.measurement} onValueChange={(value) => setGuias({...guias, measurement: value})} disabled={!guias.product}>
                        <SelectTrigger>
                          <SelectValue placeholder="Medida" />
                        </SelectTrigger>
                        <SelectContent>
                          {['2.5', '3', '3.5', '4', '4.5', '6'].map(measurement => (
                            <SelectItem key={measurement} value={measurement}>{measurement}m</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="0"
                        value={guias.quantity}
                        onChange={(e) => setGuias({...guias, quantity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label>Precio</Label>
                      <Input 
                        value={guias.product && guias.measurement ? `${(getUnitPrice('guias', guias.product, guias.measurement) * guias.quantity).toLocaleString()}` : '$0'}
                        readOnly 
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                {/* Ángulos */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-semibold mb-3 text-primary">Ángulos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Tipo de Ángulo</Label>
                      <Select value={angulos.product} onValueChange={(value) => setAngulos({...angulos, product: value, measurement: ''})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Galvanizada 32mm">Galvanizada 32mm</SelectItem>
                          <SelectItem value="Decapado 32mm">Decapado 32mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Medida</Label>
                      <Select value={angulos.measurement} onValueChange={(value) => setAngulos({...angulos, measurement: value})} disabled={!angulos.product}>
                        <SelectTrigger>
                          <SelectValue placeholder="Medida" />
                        </SelectTrigger>
                        <SelectContent>
                          {getMeasurementsByProduct('angulos', angulos.product).map(measurement => (
                            <SelectItem key={measurement} value={measurement}>{measurement}m</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="0"
                        value={angulos.quantity}
                        onChange={(e) => setAngulos({...angulos, quantity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label>Precio</Label>
                      <Input 
                        value={angulos.product && angulos.measurement ? `${(getUnitPrice('angulos', angulos.product, angulos.measurement) * angulos.quantity).toLocaleString()}` : '$0'}
                        readOnly 
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                {/* Tubos */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-semibold mb-3 text-primary">Tubos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Tipo de Tubo</Label>
                      <Select value={tubos.product} onValueChange={(value) => setTubos({...tubos, product: value, measurement: ''})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Redondo 100mm">Redondo 100mm</SelectItem>
                          <SelectItem value="Octogonal 130mm">Octogonal 130mm</SelectItem>
                          <SelectItem value="Octogonal 160mm">Octogonal 160mm</SelectItem>
                          <SelectItem value="Octogonal 180mm">Octogonal 180mm</SelectItem>
                          <SelectItem value="Octogonal 210mm">Octogonal 210mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Medida</Label>
                      <Select value={tubos.measurement} onValueChange={(value) => setTubos({...tubos, measurement: value})} disabled={!tubos.product}>
                        <SelectTrigger>
                          <SelectValue placeholder="Medida" />
                        </SelectTrigger>
                        <SelectContent>
                          {getMeasurementsByProduct('tubos', tubos.product).map(measurement => (
                            <SelectItem key={measurement} value={measurement}>{measurement}m</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="0"
                        value={tubos.quantity}
                        onChange={(e) => setTubos({...tubos, quantity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label>Precio</Label>
                      <Input 
                        value={tubos.product && tubos.measurement ? `${(getUnitPrice('tubos', tubos.product, tubos.measurement) * tubos.quantity).toLocaleString()}` : '$0'}
                        readOnly 
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                {/* Mano de Obra */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-semibold mb-3 text-primary">Mano de Obra</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="armado"
                        checked={armado}
                        onChange={(e) => setArmado(e.target.checked)}
                      />
                      <Label htmlFor="armado" className="mb-0">
                        Armado: $150
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="instalacion"
                        checked={instalacion}
                        onChange={(e) => setInstalacion(e.target.checked)}
                      />
                      <Label htmlFor="instalacion" className="mb-0">
                        Instalación: $200
                      </Label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={generateCompleteQuotation} 
                  className="w-full"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generar Cotización Completa
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Quotation Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-primary">Resumen de Cotización</CardTitle>
                <CardDescription>
                  {quotationNumber && <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{quotationNumber}</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quotationItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No hay productos agregados</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {quotationItems.map(item => (
                        <div key={item.id} className="border rounded-lg p-3 bg-muted/50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{item.product}</h4>
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                              {item.measurement && (
                                <p className="text-xs text-muted-foreground">Medida: {item.measurement}m</p>
                              )}
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs">
                                  {item.quantity} x ${item.unitPrice.toLocaleString()}
                                </span>
                                <span className="font-semibold text-primary">
                                  ${item.total.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromQuotation(item.id)}
                              className="ml-2 h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-primary">
                          ${getTotalAmount().toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Button 
                          onClick={sendEmailQuotation}
                          className="w-full"
                          disabled={quotationItems.length === 0 || !clientEmail || isEmailSending}
                        >
                          {isEmailSending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4 mr-2" />
                              Enviar Cotización
                            </>
                          )}
                        </Button>

                        <Button 
                          onClick={exportQuotation}
                          variant="outline"
                          className="w-full"
                          disabled={quotationItems.length === 0}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Exportar JSON
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          onClick={() => window.print()}
                          className="w-full"
                          disabled={quotationItems.length === 0}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Imprimir
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Print View */}
        <div className="hidden print:block mt-8">
          <div className="max-w-4xl mx-auto p-8 bg-white">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">COTIZACIÓN</h1>
              <p className="text-gray-600">Cortinas Eléctricas Profesionales</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Datos del Cliente:</h3>
                <p><strong>Nombre:</strong> {clientName}</p>
                <p><strong>Email:</strong> {clientEmail}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Datos de la Cotización:</h3>
                <p><strong>Número:</strong> {quotationNumber}</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Producto</th>
                  <th className="border border-gray-300 p-2 text-center">Medida</th>
                  <th className="border border-gray-300 p-2 text-center">Cantidad</th>
                  <th className="border border-gray-300 p-2 text-right">Precio Unit.</th>
                  <th className="border border-gray-300 p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {quotationItems.map(item => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2">
                      {item.product}
                      <br />
                      <small className="text-gray-600">{item.category}</small>
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {item.measurement ? `${item.measurement}m` : '-'}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 p-2 text-right">${item.unitPrice.toLocaleString()}</td>
                    <td className="border border-gray-300 p-2 text-right font-semibold">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="border border-gray-300 p-2 text-right font-bold">TOTAL:</td>
                  <td className="border border-gray-300 p-2 text-right font-bold text-lg">${getTotalAmount().toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <div className="text-center text-gray-600 text-sm">
              <p>Esta cotización tiene validez de 30 días desde la fecha de emisión.</p>
              <p>Los precios están sujetos a cambios sin previo aviso.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CotizadorCortinasElectricas;