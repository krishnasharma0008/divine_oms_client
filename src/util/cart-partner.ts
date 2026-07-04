import { CartDetail } from "@/interface";

export function getCartPartnerLabel(item: CartDetail): string {
  if (item.order_for === "Retail Customer") {
    return "Divine Solitaires";
  }
  return item.customer_name?.trim() || "Unknown partner";
}

export function groupCartByPartner(
  items: CartDetail[]
): { partner: string; items: CartDetail[] }[] {
  const groups = new Map<string, CartDetail[]>();

  for (const item of items) {
    const partner = getCartPartnerLabel(item);
    const list = groups.get(partner) ?? [];
    list.push(item);
    groups.set(partner, list);
  }

  return Array.from(groups.entries()).map(([partner, groupItems]) => ({
    partner,
    items: groupItems,
  }));
}
