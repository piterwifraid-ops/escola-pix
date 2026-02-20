import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateUf, setStateUf] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");
  const [deliveryType, setDeliveryType] = useState("PAC");
  const [selectedKit, setSelectedKit] = useState<SelectedKit | null>(null);

  useEffect(() => {
    const savedKit = localStorage.getItem("selectedKit");
    if (savedKit) {
      setSelectedKit(JSON.parse(savedKit));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Salva os dados de endereço no localStorage
    localStorage.setItem("checkoutAddress", JSON.stringify({
      cep: cep.replace(/\D/g, ""),
      street,
      number,
      complement,
      neighborhood,
      city,
      state: stateUf,
      deliveryType,
    }));
    navigate("/Checkout/address/payment");
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCep(value.replace(/(\d{5})(\d{0,3})/, "$1-$2"));
    setCepError("");
    if (value.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await res.json();
        if (data.erro) {
          setCepError("CEP não encontrado");
          setStreet("");
          setNeighborhood("");
          setCity("");
          setStateUf("");
        } else {
          setStreet(data.logradouro || "");
          setNeighborhood(data.bairro || "");
          setCity(data.localidade || "");
          setStateUf(data.uf || "");
        }
      } catch {
        setCepError("Erro ao buscar CEP");
      } finally {
        setLoadingCep(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#D73B3B] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors" onClick={() => navigate(-1)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
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
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs font-medium hidden sm:inline">Compra Segura</span>
          </div>
        </div>
      </header>
      {/* Barra de progresso do checkout */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="w-full">
            {/* Mobile */}
            <div className="sm:hidden">
              <div className="flex items-center justify-center gap-2 px-4 py-3">
                <div className="flex items-center">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all bg-[#D73B3B] text-white cursor-pointer hover:bg-[#C13333]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <div className="w-8 h-0.5 mx-1 bg-[#D73B3B]"></div>
                </div>
                <div className="flex items-center">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all bg-[#D73B3B] text-white" disabled>2</button>
                  <div className="w-8 h-0.5 mx-1 bg-gray-200"></div>
                </div>
                <div className="flex items-center">
                  <button disabled className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all bg-gray-200 text-gray-400">3</button>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-gray-700 pb-2">Endereço</p>
            </div>
            {/* Desktop */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-center gap-4 px-4 py-4">
                <div className="flex items-center">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer hover:bg-[#D73B3B]/10">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#D73B3B] text-white">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-800">Dados Pessoais</span>
                  </button>
                  <div className="w-12 h-0.5 mx-2 bg-[#D73B3B]"></div>
                </div>
                <div className="flex items-center">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all" disabled>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-[#D73B3B] text-white">2</span>
                    <span className="text-sm font-medium text-gray-800">Endereço</span>
                  </button>
                  <div className="w-12 h-0.5 mx-2 bg-gray-200"></div>
                </div>
                <div className="flex items-center">
                  <button disabled className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all opacity-50">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-400">3</span>
                    <span className="text-sm font-medium text-gray-400">Pagamento</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-[#D73B3B]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#D73B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Endereço de Entrega</h2>
                      <p className="text-sm text-gray-500">Informe onde deseja receber seu pedido</p>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                    <div className="relative">
                      <input
                        id="cep"
                        placeholder="00000-000"
                        maxLength={9}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400"
                        required
                        type="text"
                        value={cep}
                        onChange={handleCepChange}
                      />
                    </div>
                    <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className="text-xs text-[#D73B3B] hover:underline mt-1 inline-block">Não sei meu CEP</a>
                    {cepError && <p className="text-xs text-red-500 mt-1">{cepError}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                      <input
                        id="street"
                        placeholder="Nome da rua"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100"
                        required
                        type="text"
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                      <input
                        id="number"
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400"
                        required
                        type="text"
                        value={number}
                        onChange={e => setNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                    <input
                      id="complement"
                      placeholder="Apto, bloco, etc (opcional)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400"
                      type="text"
                      value={complement}
                      onChange={e => setComplement(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                    <input
                      id="neighborhood"
                      placeholder="Bairro"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100"
                      required
                      type="text"
                      value={neighborhood}
                      onChange={e => setNeighborhood(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                      <input
                        id="city"
                        placeholder="Cidade"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100"
                        required
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="stateUf" className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                      <input
                        id="stateUf"
                        placeholder="UF"
                        maxLength={2}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 uppercase"
                        required
                        type="text"
                        value={stateUf}
                        onChange={e => setStateUf(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Entrega */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-[#D73B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      <h3 className="font-medium text-gray-900">Escolha uma forma de entrega:</h3>
                    </div>
                    <div className="space-y-3">
                      <button type="button" className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${deliveryType === "PAC" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`} onClick={() => setDeliveryType("PAC")}> 
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${deliveryType === "PAC" ? "border-blue-500" : "border-gray-300"}`}>
                          {deliveryType === "PAC" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2"><span className="font-medium text-gray-900">Correios - PAC</span></div>
                          <p className="text-sm text-gray-500">4 a 7 dias</p>
                        </div>
                        <div className="text-right"><span className="font-semibold text-green-600">Grátis</span></div>
                      </button>
                      <button type="button" className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${deliveryType === "SEDEX" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`} onClick={() => setDeliveryType("SEDEX")}> 
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${deliveryType === "SEDEX" ? "border-blue-500" : "border-gray-300"}`}>
                          {deliveryType === "SEDEX" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2"><span className="font-medium text-gray-900">Correios - SEDEX</span><span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded flex items-center gap-0.5"><svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>FULL</span></div>
                          <p className="text-sm text-gray-500">2 a 3 dias</p>
                        </div>
                        <div className="text-right"><span className="font-medium text-gray-900">R$ 11,74</span></div>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 rounded-xl transition-all duration-200" onClick={() => navigate(-1)}>Voltar</button>
                    <button type="submit" className="flex-[2] bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed" disabled={loadingCep}>{loadingCep ? 'Buscando endereço...' : 'Continuar'}</button>
                  </div>
                </form>
              </div>
            </div>
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
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-400 line-through">{selectedKit?.original}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-green-600">Desconto (Subsídio)</span><span className="text-green-600">Aplicado</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Frete (Sedex)</span><span className="text-green-600 font-medium">Grátis</span></div>
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
                <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-[#D73B3B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Compra 100% Segura</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-[#D73B3B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Produto Original Panini</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-[#D73B3B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      <span>Entrega Garantida</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
