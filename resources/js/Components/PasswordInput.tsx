/**
 * Componente PasswordInput reutilizable
 * Input de contraseña con tooltip informativo, toggle de visibilidad y validaciones
 * 
 * @author Yariangel Aray
 * @version 1.0
 * @date 2025-11-19
 */

import { forwardRef, useState } from 'react';
import { Eye, EyeOff, InfoIcon } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/Components/ui/input-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from "@/components/ui/tooltip";
import { handlePasswordKeyDown, handleLimit } from '@/lib/keydownValidations';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    maxLength?: number;
    autoComplete?: string;
    hasError?: boolean;
    disabled?: boolean;
    tooltipMessage?: string;
    showTooltip?: boolean;
    required?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    (
        {
            id,
            name,
            value,
            onChange,
            placeholder = "Ingresa tu contraseña",
            className,
            maxLength = 20,
            autoComplete = "current-password",
            hasError = false,
            disabled = false,
            tooltipMessage = "Ingresa tu contraseña de forma segura",
            showTooltip = true,
            required = false,
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <InputGroup>
                {/* Tooltip informativo (opcional) */}
                {showTooltip && (
                    <InputGroupAddon align="inline-start">
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <InputGroupButton
                                        variant="ghost"
                                        aria-label="Información de contraseña"
                                        size="icon-xs"
                                        type="button"
                                        disabled={disabled}
                                    >
                                        <InfoIcon className="h-4 w-4" />
                                    </InputGroupButton>
                                </TooltipTrigger>
                                <TooltipContent side='top' align='start' className='max-w-xs'>
                                    <p className="text-xs">{tooltipMessage}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </InputGroupAddon>
                )}

                {/* Input de contraseña */}
                <InputGroupInput
                    ref={ref}
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        handlePasswordKeyDown(e);
                        handleLimit(e, value, maxLength);
                    }}
                    className={cn(
                        hasError && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    required={required}
                />

                {/* Toggle mostrar/ocultar contraseña */}
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        size="icon-xs"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        disabled={disabled}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;