import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedKit, setSelectedKit] = useState(null);

  useEffect(() => {
    const kit = localStorage.getItem("selectedKit");
    if (kit) setSelectedKit(JSON.parse(kit));
    
    // Recupera dados do cliente se existirem
    const savedCustomer = localStorage.getItem("checkoutCustomer");
    if (savedCustomer) {
      const customer = JSON.parse(savedCustomer);
      setName(customer.name || "");
      setEmail(customer.email || "");
      setCpf(customer.cpf || "");
      setPhone(customer.phone || "");
    }
  }, []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Salva os dados do cliente no localStorage
    localStorage.setItem("checkoutCustomer", JSON.stringify({
      name,
      email,
      cpf,
      phone,
    }));
    navigate("/Checkout/address");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 11);
    if (value.length > 0) value = value.replace(/^([0-9]{2})([0-9]{0,1})/, "($1) $2");
    if (value.length > 6) value = value.replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    setPhone(value);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#D73B3B] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            {/* Ícone de voltar */}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline text-sm">Voltar</span>
          </button>
          <div className="flex items-center">
            <img alt="Drogasil" className="h-10 object-contain" src="/images/logo-drogasil.png" />
          </div>
          <div className="flex items-center gap-1 text-white/90">
            {/* Ícone de compra segura */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs font-medium hidden sm:inline">Compra Segura</span>
          </div>
        </div>
      </header>
      {/* Conteúdo principal simplificado */}
      <main className="flex-1 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <form className="space-y-4" onSubmit={handleContinue}>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-[#D73B3B]/10 rounded-full flex items-center justify-center">
                      {/* Ícone usuário */}
                      <svg className="w-5 h-5 text-[#D73B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Dados Pessoais</h2>
                      <p className="text-sm text-gray-500">Preencha seus dados para continuar</p>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                    <input 
                      id="name" 
                      placeholder="Digite seu nome completo" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400" 
                      required 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                    <input 
                      id="email" 
                      placeholder="seu@email.com" 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400" 
                      required 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                    <input
                      id="cpf"
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400"
                      required
                      type="text"
                      value={cpf}
                      onChange={handleCpfChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone/WhatsApp *</label>
                    <input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      maxLength={16}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D73B3B] focus:border-[#D73B3B] outline-none transition-all placeholder:text-gray-400"
                      required
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] mt-6">Continuar</button>
                  <p className="text-xs text-gray-400 text-center mt-4">Seus dados estão protegidos e não serão compartilhados.</p>
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
                      {selectedKit ? (
                        <>
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            {selectedKit.productImg && (
                              <img alt={selectedKit.label} className="w-full h-full object-cover" src={selectedKit.productImg} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm">{selectedKit.label}</h4>
                            {selectedKit.badge && (
                              <span className="inline-block px-2 py-0.5 text-xs font-bold text-white rounded mt-1 bg-red-500">{selectedKit.badge}</span>
                            )}
                            <p className="text-xs text-gray-500 mt-1">{selectedKit.desc}</p>
                            <p className="text-xs text-gray-900 mt-1 font-bold">{selectedKit.price} <span className="line-through text-gray-400 font-normal">{selectedKit.original}</span></p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm">Nenhum tratamento selecionado</h4>
                          </div>
                        </>
                      )}
                    </div>
                    {/* ...outros detalhes do pedido... */}
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
