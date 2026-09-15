// Single source of truth for the business's real contact details.
// Every enquiry, booking confirmation and footer link on the site is built from here.
export const CONTACT = {
  phoneDisplay: '0113 556 385',
  phoneIntl: '254113556385',   // used for wa.me / tel: links
  email: 'kellylemayian6@gmail.com',
  location: 'Kimana, Kajiado County, Kenya',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
};

export function waLink(message){
  const text = encodeURIComponent(message);
  return `https://wa.me/${CONTACT.phoneIntl}?text=${text}`;
}

export function telLink(){
  return `tel:+${CONTACT.phoneIntl}`;
}

export function mailtoLink(subject = '', body = ''){
  const q = new URLSearchParams();
  if (subject) q.set('subject', subject);
  if (body) q.set('body', body);
  const query = q.toString();
  return `mailto:${CONTACT.email}${query ? '?' + query : ''}`;
}

export function buildEnquiryMessage({ kind, title, details }){
  const lines = [
    `Hujambo Geo Adventures Kenya,`,
    `I'd like to ask about: ${title}`,
    kind ? `Type: ${kind}` : '',
    details || '',
    `— sent from the website`,
  ].filter(Boolean);
  return lines.join('\n');
}
