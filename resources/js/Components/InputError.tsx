export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-xs text-red-600 !mt-1 ml-2 font-semibold ' + className}
        >
            {message}
        </p>
    ) : null;
}
