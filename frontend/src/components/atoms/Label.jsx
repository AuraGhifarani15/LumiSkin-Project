const Label = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-900">
      {children}
    </label>
  );
};

export default Label;
