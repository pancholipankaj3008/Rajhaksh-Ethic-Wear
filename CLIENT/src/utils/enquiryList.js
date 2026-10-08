const key = "raj-haksh-enquiry";
const legacyKey = "nextgen-wholesale-enquiry";
export const getEnquiryList = () => {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  const legacy = localStorage.getItem(legacyKey);
  if (!legacy) return [];
  localStorage.setItem(key, legacy);
  localStorage.removeItem(legacyKey);
  return JSON.parse(legacy);
};
export const saveEnquiryList = (items) => localStorage.setItem(key, JSON.stringify(items));
export const addEnquiryItem = (item) => { const items = getEnquiryList(); const index = items.findIndex((entry) => entry.productId === item.productId && entry.size === item.size); if (index >= 0) items[index].quantity += item.quantity; else items.push(item); saveEnquiryList(items); return items; };
