export interface ValidatedGiftCard {
  code: string;
  remaining_balance: number;
}

interface GiftCardResponse {
  success: boolean;
  code: string;
  remaining_balance: number;
  error?: string;
}

const GIFT_CARD_API =
  "https://www.bymarcel.se/Server/api/validate-gift-card.php";

export async function validateGiftCard(
  code: string,
): Promise<ValidatedGiftCard> {
  const response = await fetch(GIFT_CARD_API, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      code: code.trim(),
    }),
  });

  const data: GiftCardResponse =
    await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.error ?? "Kunde inte kontrollera presentkortet",
    );
  }

  return {
    code: data.code,
    remaining_balance: data.remaining_balance,
  };
}