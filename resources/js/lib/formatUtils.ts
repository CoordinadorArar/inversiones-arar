export function formatToSpanishDate(dateString) {
    // 1. Crear un objeto Date a partir del string ISO "YYYY-MM-DD".
    // JavaScript interpreta correctamente este formato estándar.
    const dateObj = new Date(dateString.split(' ')[0] + 'T00:00:00');

    // 2. Usar Intl.DateTimeFormat para formatear la fecha.
    // Especificamos 'es' (español).
    // Definimos las opciones para día numérico, mes largo (nombre completo) y año numérico.
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
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

export const calcularAntiguedadExacta = (fechaIngresoString) => {
    // Convertimos la fecha de ingreso a objeto Date.
    // Ignoramos la parte de la hora "00:00:00.000" para calcular días completos.
    const ingreso = new Date(fechaIngresoString.split(' ')[0]);
    const hoy = new Date();

    let años = hoy.getFullYear() - ingreso.getFullYear();
    let meses = hoy.getMonth() - ingreso.getMonth();
    let dias = hoy.getDate() - ingreso.getDate();

    // Ajustar si los días son negativos (la fecha de hoy es anterior al día de ingreso en este mes)
    if (dias < 0) {
        meses--;
        // Calcular los días del mes anterior para añadirlos
        const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, ingreso.getDate());
        dias = Math.floor((hoy - mesAnterior) / (1000 * 60 * 60 * 24));
    }

    // Ajustar si los meses son negativos
    if (meses < 0) {
        años--;
        meses = 12 + meses;
    }

    // Formatear el resultado en una cadena legible
    const añosStr = años > 0 ? `${años} año${años !== 1 ? 's' : ''}` : '';
    const mesesStr = meses > 0 ? `${meses} mes${meses !== 1 ? 'es' : ''}` : '';
    const diasStr = dias > 0 ? `${dias} día${dias !== 1 ? 's' : ''}` : '';

    const partes = [añosStr, mesesStr, diasStr].filter(Boolean);
    
    if (partes.length === 0) return "Menos de 1 día";

    // Unir las partes con comas, o "y" para la última parte si hay más de dos
    if (partes.length === 3) {
        return `${partes[0]}, ${partes[1]} y ${partes[2]}`;
    } else if (partes.length === 2) {
        return `${partes[0]} y ${partes[1]}`;
    } else {
        return partes[0];
    }
};