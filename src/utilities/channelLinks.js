/* ==========================================================
   CHANNEL LINKS — wa.me / mailto: / tel: / m.me link builders.
   ========================================================== */
export const waLink = (contact, text) => `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
export const mailLink = (contact, subject='') => `mailto:${contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
export const telLink = (contact) => `tel:${(contact.phone||'').replace(/\s+/g,'')}`;
export const messengerLink = (pageIdOrUsername) => `https://m.me/${pageIdOrUsername}`;
