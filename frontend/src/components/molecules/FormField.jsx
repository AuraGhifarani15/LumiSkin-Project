import Input from '../atoms/input';
import Label from '../atoms/Label';

const FormField = ({ label, name, type = 'text', placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
};

export default FormField;
