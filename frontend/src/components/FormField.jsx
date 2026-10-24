function FormField({
  label,
  name,
  error,
  as: Component = "input",
  children,
  ...props
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Component
        id={name}
        name={name}
        {...props}
        className={`mt-1 w-full rounded border px-3 py-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {children}
      </Component>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default FormField;
