export function formatToSpanishDate(dateString) {
    // 1. Crear un objeto Date a partir del string ISO "YYYY-MM-DD".
    // JavaScript interpreta correctamente este formato estándar.
    const dateObj = new Date(dateString);

    // 2. Usar Intl.DateTimeFormat para formatear la fecha.
    // Especificamos 'es' (español).
    // Definimos las opciones para día numérico, mes largo (nombre completo) y año numérico.
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };

    let formattedDate = new Intl.DateTimeFormat('es', options).format(dateObj);
    // 1. Reemplazar " de " por ", "
    // Esto convierte "04 de enero de 2007" en "04, enero de 2007"
    formattedDate = formattedDate.replace(' de ', ', ');

    // 2. Capitalizar la primera letra del mes
    // Identificamos dónde empieza el nombre del mes (después de la coma y el espacio)
    const parts = formattedDate.split(', ');

    const dayPart = parts[0];
    const monthYearPart = parts[1];

    // Capitalizamos la primera letra del mes
    const capitalizedMonthYear = monthYearPart.charAt(0).toUpperCase() + monthYearPart.slice(1);

    // Reconstruimos la cadena
    formattedDate = `${dayPart}, ${capitalizedMonthYear}`;


    // El resultado de format() será algo como "4 de enero de 2007".
    return formattedDate;
}

export function formatPhoneNumberCO(phoneNumberString) {
  // Asegúrate de que la entrada sea tratada como string y elimina cualquier caracter no numérico
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');

  // Comprueba si el número tiene exactamente 10 dígitos
  if (cleaned.length !== 10) {
    return phoneNumberString; // Devuelve el original si no es un número colombiano válido
  }

  // Usa una expresión regular para aplicar el formato: (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    // match[0] es el string completo, match[1] es el primer grupo (Ej. 300), etc.
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumberString; // Fallback si algo falla
}

export function formatLandlinePhoneNumberCO(phoneNumberString) {
  // Asegúrate de que la entrada sea tratada como string y elimina caracteres no numéricos
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');

  // Los fijos colombianos ahora suelen tener 10 dígitos (ej: 601 123 4567)
  // aunque a veces llegan solo los 7 dígitos locales.

  // Caso 1: Tiene 10 dígitos (código de área incluido)
  if (cleaned.length === 10 && cleaned.startsWith('60')) {
    // Aplica formato: (60X) XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  } 
  
  // Caso 2: Tiene solo 7 dígitos (asumimos que el código de área se maneja aparte o ya se sabe)
  else if (cleaned.length === 7) {
    // Aplica formato: XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}`;
    }
  }

  // Si no coincide con ninguno de los formatos esperados, devuelve el original
  return phoneNumberString;
}