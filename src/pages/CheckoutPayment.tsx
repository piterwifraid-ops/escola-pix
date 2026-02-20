import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPixTransaction, type TransactionResponse, type ShippingData } from "../services/pixApi";

interface SelectedKit {
  id: number;
  label: string;
  desc: string;
  original: string;
  price: string;
  badge: string | null;
  highlight: boolean;
  productImg: string | undefined;
}

// Dados de teste padrão para desenvolvimento
const DEFAULT_CUSTOMER = {
  name: "João da Silva",
  email: "joao.silva@email.com",
  phone: "11999998888",
  cpf: "12345678909",
};

const DEFAULT_SHIPPING: ShippingData = {
  street: "Avenida Paulista",
  number: "1000",
  complement: "Apto 101",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "SP",
  zipCode: "01310100",
};

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKit, setSelectedKit] = useState<SelectedKit | null>(null);

  // Dados do cliente (recuperados do localStorage ou usa dados padrão)
  const [customerData, setCustomerData] = useState(DEFAULT_CUSTOMER);

  // Dados de endereço (recuperados do localStorage ou usa dados padrão)
  const [shippingData, setShippingData] = useState<ShippingData>(DEFAULT_SHIPPING);

  useEffect(() => {
    // Tenta recuperar o kit selecionado
    const savedKit = localStorage.getItem("selectedKit");
    if (savedKit) {
      setSelectedKit(JSON.parse(savedKit));
    }

    // Tenta recuperar dados do cliente salvos anteriormente
    const savedCustomer = localStorage.getItem("checkoutCustomer");
    if (savedCustomer) {
      const parsed = JSON.parse(savedCustomer);
      // Só usa se todos os campos obrigatórios estiverem preenchidos
      if (parsed.name && parsed.email && parsed.phone && parsed.cpf) {
        setCustomerData(parsed);
      }
    }

    // Tenta recuperar dados de endereço salvos anteriormente
    const savedAddress = localStorage.getItem("checkoutAddress");
    if (savedAddress) {
      const address = JSON.parse(savedAddress);
      // Só usa se todos os campos obrigatórios estiverem preenchidos
      if (address.street && address.city && address.state && address.cep) {
        setShippingData({
          street: address.street,
          number: address.number || "S/N",
          complement: address.complement || "",
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zipCode: address.cep,
        });
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Extrai o valor numérico do preço (ex: "R$ 697,00" -> 69700 centavos)
      const priceString = selectedKit?.price || "R$ 0,00";
      const numericValue = parseFloat(priceString.replace(/[^\d,]/g, "").replace(",", "."));
      const totalAmount = Math.round(numericValue * 100);

      // Criar transação PIX
      const response: TransactionResponse = await createPixTransaction({
        customer: customerData,
        amount: totalAmount,
        items: [
          {
            name: selectedKit?.label || "Tratamento Mounjaro",
            quantity: 1,
            unitPrice: totalAmount,
            isPhysical: true,
          },
        ],
        shipping: shippingData,
        externalId: `order-${Date.now()}`,
      });

      // Salva os dados da transação e navega para a tela do PIX
      localStorage.setItem("pixTransaction", JSON.stringify(response.data));
      navigate("/Checkout/address/payment/pix");
    } catch (err) {
      console.error("Erro ao criar transação PIX:", err);
      setError(err instanceof Error ? err.message : "Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#D73B3B] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="hidden sm:inline text-sm">Voltar</span>
          </button>
          <div className="flex items-center">
            <img 
              alt="Drogasil" 
              className="mx-auto h-14 w-auto object-contain sm:h-16" 
              src="/images/logo-drogasil.png" 
              style={{ maxWidth: '220px', width: '80vw' }}
            />
          </div>
          <div className="flex items-center gap-1 text-white/90">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <span className="text-xs font-medium hidden sm:inline">Compra Segura</span>
          </div>
        </div>
      </header>

      {/* Etapas do checkout */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="w-full">
            {/* Mobile steps */}
            <div className="sm:hidden">
              <div className="flex items-center justify-center gap-2 px-4 py-3">
                <div className="flex items-center">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all bg-[#D73B3B] text-white cursor-pointer hover:bg-[#C13333]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </button>
                  <div className="w-8 h-0.5 mx-1 bg-[#D73B3B]"></div>
                </div>
                <div className="flex items-center">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all bg-[#D73B3B] text-white cursor-pointer hover:bg-[#C13333]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </button>
                  <div className="w-8 h-0.5 mx-1 bg-[#D73B3B]"></div>
                </div>
                <div className="flex items-center">
                  <button disabled className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all bg-[#D73B3B] text-white">3</button>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-gray-700 pb-2">Pagamento</p>
            </div>
            {/* Desktop steps */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-center gap-4 px-4 py-4">
                <div className="flex items-center">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer hover:bg-[#D73B3B]/10">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#D73B3B] text-white">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-sm font-medium text-gray-800">Dados Pessoais</span>
                  </button>
                  <div className="w-12 h-0.5 mx-2 bg-[#D73B3B]"></div>
                </div>
                <div className="flex items-center">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer hover:bg-[#D73B3B]/10">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#D73B3B] text-white">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-sm font-medium text-gray-800">Endereço</span>
                  </button>
                  <div className="w-12 h-0.5 mx-2 bg-[#D73B3B]"></div>
                </div>
                <div className="flex items-center">
                  <button disabled className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#D73B3B] text-white">3</span>
                    <span className="text-sm font-medium text-gray-800">Pagamento</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Coluna principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-[#D73B3B]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#D73B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Forma de Pagamento</h2>
                      <p className="text-sm text-gray-500">Escolha como deseja pagar</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {/* PIX */}
                    <button type="button" className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left border-[#D73B3B] bg-[#D73B3B]/5">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#D73B3B]">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 16 16" fill="currentColor"><path d="M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z"></path><path d="m14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z"></path></svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><span className="font-semibold text-gray-900">PIX</span><span className="px-2 py-0.5 bg-[#D73B3B]/10 text-[#D73B3B] text-xs font-bold rounded">RECOMENDADO</span></div>
                        <p className="text-sm text-gray-500">Aprovação Instantânea</p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-[#D73B3B] bg-[#D73B3B] flex items-center justify-center">
                        <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    </button>
                  </div>
                  {/* Botões de ação */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3 mt-6">
                    <button type="button" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Voltar</button>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex-[2] bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processando...
                        </>
                      ) : (
                        "Finalizar Compra"
                      )}
                    </button>
                  </div>
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Total a pagar: <span className="font-bold text-gray-900">R$ 149,00</span></p>
                  </div>
                </form>
              </div>
            </div>
            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-[#D73B3B] px-4 py-3">
                    <h3 className="font-semibold text-white">Resumo do Pedido</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {selectedKit?.productImg && (
                          <img alt={selectedKit.label} className="w-full h-full object-cover" src={selectedKit.productImg} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{selectedKit?.label || "Nenhum tratamento selecionado"}</h4>
                        {selectedKit?.badge && (
                          <span className="inline-block px-2 py-0.5 text-xs font-bold text-white rounded mt-1 bg-red-500">{selectedKit.badge}</span>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{selectedKit?.desc}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-400 line-through">{selectedKit?.original}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Desconto (Subsídio)</span>
                        <span className="text-green-600">Aplicado</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Frete (Sedex)</span>
                        <span className="text-green-600 font-medium">Grátis</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">Total</span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-[#D73B3B]">{selectedKit?.price || "R$ 0,00"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bloco de garantias */}
                <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-[#D73B3B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <span>Compra 100% Segura</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-[#D73B3B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span>Produto Original Panini</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-[#D73B3B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                      <span>Entrega Garantida</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bloco de benefícios */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Clientes Satisfeitos */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-16 h-16">
                {/* Ícone de satisfação */}
                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="url(#satisfactionGradient)" /><circle cx="32" cy="32" r="24" fill="white" /><path d="M22 32L28 38L42 24" stroke="#D73B3B" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /><text x="32" y="50" textAnchor="middle" fill="#D73B3B" fontSize="8" fontWeight="bold">100%</text><defs><linearGradient id="satisfactionGradient" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#D73B3B" /><stop offset="100%" stopColor="#C13333" /></linearGradient></defs></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#D73B3B]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <h3 className="font-bold text-gray-900 mt-1">Clientes Satisfeitos</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">Garantimos a satisfação de 100% dos nossos clientes. São mais de 50.000 clientes satisfeitos em 2025.</p>
              </div>
            </div>
            {/* Envio Rápido */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none"><rect x="4" y="20" width="36" height="24" rx="2" fill="#D73B3B" /><path d="M40 28H52C54.2091 28 56 29.7909 56 32V40C56 42.2091 54.2091 44 52 44H40V28Z" fill="#C13333" /><rect x="44" y="32" width="8" height="6" rx="1" fill="white" opacity="0.9" /><circle cx="16" cy="46" r="6" fill="#333" /><circle cx="16" cy="46" r="3" fill="#666" /><circle cx="48" cy="46" r="6" fill="#333" /><circle cx="48" cy="46" r="3" fill="#666" /><path d="M2 26H8" stroke="#D73B3B" strokeWidth={2} strokeLinecap="round" opacity="0.5" /><path d="M0 32H6" stroke="#D73B3B" strokeWidth={2} strokeLinecap="round" opacity="0.5" /><path d="M2 38H8" stroke="#D73B3B" strokeWidth={2} strokeLinecap="round" opacity="0.5" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#D73B3B]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <h3 className="font-bold text-gray-900 mt-1">Envio Rápido</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">Após a aprovação da compra, o pedido é separado para envio de imediato. O código de rastreio é enviado pelo e-mail e WhatsApp.</p>
              </div>
            </div>
            {/* Devolução Grátis */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none"><path d="M12 24L32 14L52 24V44L32 54L12 44V24Z" fill="#D73B3B" stroke="#C13333" strokeWidth={2} /><path d="M12 24L32 34L52 24" stroke="#C13333" strokeWidth={2} /><path d="M32 34V54" stroke="#C13333" strokeWidth={2} /><path d="M38 8C44 8 48 12 48 18C48 24 44 28 38 28H28" stroke="#D73B3B" strokeWidth={3} strokeLinecap="round" fill="none" /><path d="M32 24L28 28L32 32" stroke="#D73B3B" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#D73B3B]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <h3 className="font-bold text-gray-900 mt-1">Devolução Grátis</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">Você tem 7 dias a partir do recebimento do pedido para devolução caso o mesmo não corresponda às suas expectativas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-[#D73B3B]/5 border-t border-[#D73B3B]/10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#D73B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span>Compra 100% Segura</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#D73B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span>Produto Original</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#D73B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              <span>Entrega Garantida</span>
            </div>
          </div>
          <div className="border-t border-[#D73B3B]/10 py-4">
            <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-500">
              <p className="font-semibold text-[#D73B3B] mb-1">PANINI BRASIL LTDA</p>
              <p>CNPJ: 50.870.611/0001-06</p>
              <p>Av. das Nações Unidas, 4777 - São Paulo - SP, 05477-000</p>
              <p className="mt-1">contato@panini.com.br</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

