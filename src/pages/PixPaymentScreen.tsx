import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { checkTransactionStatus, fromCents } from "../services/pixApi";

interface TransactionData {
  id: string;
  amount: number;
  status: string;
  pix: {
    qrcode: string;
    expirationDate: string;
  };
  customer: {
    name: string;
  };
  items: Array<{
    title: string;
    unitPrice: number;
    quantity: number;
  }>;
}

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

export default function PixPaymentScreen() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("15:00");
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKit, setSelectedKit] = useState<SelectedKit | null>(null);

  // Carrega dados da transação do localStorage
  useEffect(() => {
    const savedTransaction = localStorage.getItem("pixTransaction");
    if (savedTransaction) {
      setTransaction(JSON.parse(savedTransaction));
    } else {
      // Se não há transação, volta para o checkout
      navigate("/Checkout/address/payment");
    }

    // Carrega o kit selecionado
    const savedKit = localStorage.getItem("selectedKit");
    if (savedKit) {
      setSelectedKit(JSON.parse(savedKit));
    }
  }, [navigate]);

  // Polling para verificar status do pagamento
  const checkPaymentStatus = useCallback(async () => {
    if (!transaction || isPaid) return;

    try {
      const response = await checkTransactionStatus(transaction.id);
      if (response.data.status === "paid") {
        setIsPaid(true);
        localStorage.removeItem("pixTransaction");
        // Após 3 segundos, redireciona para página de sucesso
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      console.error("Erro ao verificar status:", err);
    }
  }, [transaction, isPaid, navigate]);

  // Polling a cada 5 segundos
  useEffect(() => {
    if (!transaction || isPaid) return;

    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [transaction, isPaid, checkPaymentStatus]);

  // Timer de expiração
  useEffect(() => {
    if (!transaction || isPaid) return;

    const expirationDate = new Date(transaction.pix.expirationDate);
    const now = new Date();
    
    // Se a data de expiração é só a data (sem hora), assume 15 minutos a partir de agora
    let totalSeconds = Math.max(0, Math.floor((expirationDate.getTime() - now.getTime()) / 1000));
    if (totalSeconds > 86400) totalSeconds = 900; // 15 minutos padrão

    const timer = setInterval(() => {
      totalSeconds--;
      if (totalSeconds <= 0) {
        setTimeLeft("00:00");
        clearInterval(timer);
        setError("Tempo expirado. Por favor, gere um novo código PIX.");
      } else {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [transaction, isPaid]);

  // Função para copiar código PIX
  const handleCopyPix = async () => {
    if (!transaction) return;
    
    try {
      await navigator.clipboard.writeText(transaction.pix.qrcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#D73B3B] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-[#D73B3B] sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center">
            <img alt="Drogasil" className="h-10 object-contain" src="/images/logo-drogasil.png" />
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h2>
            <p className="text-gray-600 mb-4">Seu pedido foi processado com sucesso.</p>
            <p className="text-sm text-gray-500">Redirecionando...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#D73B3B] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate("/Checkout/address/payment")}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline text-sm">Voltar</span>
          </button>
          <div className="flex items-center">
            <img alt="Drogasil" className="h-10 object-contain" src="/images/logo-drogasil.png" />
          </div>
          <div className="flex items-center gap-1 text-white/90">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs font-medium hidden sm:inline">Compra Segura</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
        {/* Etapas */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#D73B3B] text-white font-bold">✓</div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#D73B3B] text-white font-bold">✓</div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#D73B3B] text-white font-bold">3</div>
        </div>
        <div className="text-center mb-4">
          <span className="text-gray-700 font-medium">Pagamento</span>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Pagamento via PIX */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-400"></span>
            <span className="font-semibold text-gray-800">Pagamento via PIX</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">Escaneie o QR Code para pagar</p>
          <div className="bg-yellow-100 rounded-lg flex items-center justify-center py-2 mb-2">
            <span className="text-yellow-700 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
              Pague em até: <span className="font-bold">{timeLeft}</span>
            </span>
          </div>
          <div className="flex flex-col items-center mb-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-2">
              <QRCodeSVG 
                value={transaction.pix.qrcode} 
                size={160}
                level="M"
                includeMargin={true}
              />
            </div>
            <span className="text-xs text-green-700 font-bold mb-1">Valor: {fromCents(transaction.amount)}</span>
            <span className="text-xs text-gray-600 mb-2">Escaneie o QR Code com o app do seu banco</span>
            <div className="w-full">
              <label className="block text-xs text-gray-500 mb-1">Ou copie o código PIX:</label>
              <textarea
                className="w-full text-xs bg-gray-100 border border-gray-200 rounded p-2 mb-2 resize-none font-mono"
                rows={3}
                value={transaction.pix.qrcode}
                readOnly
              />
              <button 
                onClick={handleCopyPix}
                className={`w-full ${copied ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 mb-2 transition-colors`}
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    COPIADO!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    COPIAR CÓDIGO PIX
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Como pagar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Como pagar:</h3>
          <ol className="list-decimal list-inside text-sm text-gray-700 mb-2">
            <li>Abra o app do seu banco</li>
            <li>Escolha pagar via PIX com QR Code ou código</li>
            <li>Escaneie ou cole o código e confirme o pagamento</li>
          </ol>
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Aguardando pagamento...
          </div>
          <button 
            onClick={() => navigate("/Checkout/address/payment")}
            className="w-full text-xs text-gray-500 underline hover:text-gray-700"
          >
            Escolher outra forma de pagamento
          </button>
        </div>
        {/* Resumo do Pedido */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h3 className="font-semibold text-[#D73B3B] mb-2">Resumo do Pedido</h3>
          <div className="flex gap-3 mb-2">
            {selectedKit?.productImg && (
              <img src={selectedKit.productImg} alt={selectedKit.label} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm">{selectedKit?.label || "Tratamento"}</h4>
              {selectedKit?.badge && (
                <span className="inline-block px-2 py-0.5 text-xs font-bold text-white rounded mt-1 bg-red-500">{selectedKit.badge}</span>
              )}
              <p className="text-xs text-gray-500 mt-1">{selectedKit?.desc}</p>
            </div>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-400 line-through">{selectedKit?.original}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-600">Desconto (Subsídio)</span>
            <span className="text-green-600">Aplicado</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Frete (Sedex)</span>
            <span className="text-green-600 font-medium">Grátis</span>
          </div>
          <div className="flex justify-between items-center mt-2 mb-2">
            <span className="font-semibold text-gray-800">Total</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#D73B3B]">{selectedKit?.price || "R$ 0,00"}</span>
            </div>
          </div>
        </div>
        {/* Garantias */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-6 h-6 bg-red-100 rounded-full flex items-center justify-center"><span className="text-[#D73B3B] font-bold">✓</span></span>
            <span className="font-semibold text-gray-800">Clientes Satisfeitos</span>
          </div>
          <p className="text-xs text-gray-600 mb-2">Garantimos a satisfação de 100% dos nossos clientes. São mais de 50.000 clientes satisfeitos em 2025.</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-6 h-6 bg-red-100 rounded-full flex items-center justify-center"><span className="text-[#D73B3B] font-bold">🚚</span></span>
            <span className="font-semibold text-gray-800">Envio Rápido</span>
          </div>
          <p className="text-xs text-gray-600 mb-2">Após a aprovação da compra, o pedido é separado para envio de imediato. O código de rastreio é enviado pelo e-mail e WhatsApp.</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-6 h-6 bg-red-100 rounded-full flex items-center justify-center"><span className="text-[#D73B3B] font-bold">↩️</span></span>
            <span className="font-semibold text-gray-800">Devolução Grátis</span>
          </div>
          <p className="text-xs text-gray-600">Você tem 7 dias a partir do recebimento do pedido para devolução caso o mesmo não corresponda às suas expectativas.</p>
        </div>
        {/* Footer */}
        <footer className="text-center text-xs text-gray-500 mt-4">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <span className="flex items-center gap-1"><span className="text-[#D73B3B]">🔒</span> Compra 100% Segura</span>
            <span className="flex items-center gap-1"><span className="text-[#D73B3B]">🏷️</span> Produto Original</span>
            <span className="flex items-center gap-1"><span className="text-[#D73B3B]">🚚</span> Entrega Garantida</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <span className="block font-bold text-[#D73B3B]">Drogasil</span>
            <span className="block">Programa de Acesso à Saúde Metabólica</span>
            <span className="block">contato@drogasil.com.br</span>
          </div>
        </footer>
      </div>
      </div>
    </div>
  );
}
