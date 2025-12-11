import { useMemo } from "react";

/**
 * Hook para detectar cambios en un formulario.
 * Compara valores iniciales con actuales y devuelve un objeto con campos cambiados.
 * 
 * @param initialValues - Valores iniciales del formulario.
 * @param currentValues - Valores actuales del formulario.
 * @returns Objeto con campos cambiados (true si cambió).
 */
export function useFormChanges<T extends Record<string, any>>(
  initialValues: T,
  currentValues: T
): Record<keyof T, boolean> {
  return useMemo(() => {
    const changes: Record<keyof T, boolean> = {} as Record<keyof T, boolean>;
    for (const key in initialValues) {
      // Compara valores (para archivos, compara si cambió el File)
      if ((initialValues[key] as any) instanceof File || (currentValues[key] as any) instanceof File) {
        changes[key] = initialValues[key] !== currentValues[key];
      } else {
        changes[key] = initialValues[key] !== currentValues[key];
      }
    }
    return changes;
  }, [initialValues, currentValues]);
}