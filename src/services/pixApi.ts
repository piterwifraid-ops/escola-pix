// Serviço de integração com API de PIX da Evollute

const API_BASE_URL = "https://gateway.evollute.tech";
const PUBLIC_KEY = "pk_live_6f981087a75280e1cb126b9f728296b9";
const SECRET_KEY = "sk_live_a4f17310be395f61ea7763a27236621e";

// Função para criar o header de autenticação Basic Auth
const getAuthHeader = (): string => {
  const credentials = `${PUBLIC_KEY}:${SECRET_KEY}`;
  return "Basic " + btoa(credentials);
};

// Interface para dados do cliente
export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

// Interface para item do pedido
export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number; // em centavos
  isPhysical?: boolean;
  externalRef?: string;
}

// Interface para dados do PIX na resposta
export interface PixData {
  qrcode: string;
  end2EndId: string | null;
  receiptUrl: string | null;
  expirationDate: string;
}

// Interface para resposta da transação
export interface TransactionResponse {
  success: boolean;
  data: {
    id: string;
    externalId: string;
    amount: number;
    refundedAmount: number;
    companyId: number;
    paymentMethod: string;
    status: "pending" | "processing" | "paid" | "rejected" | "authorized" | "protesting" | "refunded" | "cancelled" | "chargeback";
    postbackUrl: string;
    createdAt: string;
    updatedAt: string;
    paidAt: string | null;
    customer: {
      id: number;
      name: string;
      email: string;
      phone: string;
      document: {
        number: string;
        type: string;
      };
    };
    items: Array<{
      title: string;
      unitPrice: number;
      quantity: number;
    }>;
    fee: {
      fixedAmount: number;
      spreadPercentage: number;
      estimatedFee: number;
      netAmount: number;
    };
    pix: PixData;
  };
}

// Interface para dados de entrega
export interface ShippingData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// Interface para criar transação
export interface CreateTransactionParams {
  customer: CustomerData;
  amount: number; // em centavos
  items: OrderItem[];
  shipping: ShippingData;
  externalId?: string;
  postbackUrl?: string;
}

/**
 * Cria uma nova transação PIX
 */
export async function createPixTransaction(params: CreateTransactionParams): Promise<TransactionResponse> {
  const { customer, amount, items, shipping, externalId, postbackUrl } = params;

  // Limpa o CPF (remove formatação)
  const cleanCpf = customer.cpf.replace(/\D/g, "");
  
  // Limpa o telefone (remove formatação)
  const cleanPhone = customer.phone.replace(/\D/g, "");

  // Limpa o CEP (remove formatação)
  const cleanZipCode = shipping.zipCode.replace(/\D/g, "");

  const body = {
    customer: {
      name: customer.name,
      email: customer.email,
      phone: cleanPhone,
      cpf: cleanCpf,
    },
    amount: amount,
    paymentMethod: "pix",
    externalId: externalId || `order-${Date.now()}`,
    postbackUrl: postbackUrl || "https://yourdomain.com/webhooks",
    items: items.map((item, index) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      isPhysical: item.isPhysical ?? true,
      externalRef: item.externalRef || `item-${index + 1}`,
    })),
    shipping: {
      name: customer.name,
      address: {
        street: shipping.street,
        number: shipping.number,
        complement: shipping.complement || "",
        neighborhood: shipping.neighborhood,
        city: shipping.city,
        state: shipping.state,
        zipCode: cleanZipCode,
        country: "BR",
      },
    },
    pix: {
      expiresInDays: 1,
    },
    ip: "127.0.0.1",
  };

  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ao criar transação: ${response.status}`);
  }

  return response.json();
}

/**
 * Verifica o status de uma transação
 */
export async function checkTransactionStatus(transactionId: string): Promise<TransactionResponse> {
  const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ao verificar transação: ${response.status}`);
  }

  return response.json();
}

/**
 * Converte valor em reais para centavos
 */
export function toCents(value: number): number {
  return Math.round(value * 100);
}

/**
 * Converte valor em centavos para reais formatado
 */
export function fromCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
