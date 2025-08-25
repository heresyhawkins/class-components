import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addEntry } from '../../store/formSlice';
import { useAppSelector } from '../../store/hooks';
import { Input, Checkbox, GenderPicker, Button } from '../../components/Inputs';

const MAX_LENGTH_NUMBER = 8;

interface FormData {
  name: string;
  age: string;
  email: string;
  gender: 'male' | 'female' | '';
  acceptTerms: boolean;
  country: string;
  photo: File | null;
  password: string;
  confirmPassword: string;
}

type Errors = Partial<Record<keyof FormData, string>>;

export default function ControlledForm({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector((state) => state.form);

  const [data, setData] = useState<FormData>({
    name: '',
    age: '',
    email: '',
    gender: '',
    acceptTerms: false,
    country: '',
    photo: null,
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!data.name.trim()) newErrors.name = 'Name is required';
    else if (!/^[A-Z]/.test(data.name)) newErrors.name = 'First letter must be uppercase';

    if (!data.age) newErrors.age = 'Age is required';
    else if (isNaN(Number(data.age)) || Number(data.age) <= 0)
      newErrors.age = 'Must be positive number';

    if (!data.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Invalid email';

    if (!data.gender) newErrors.gender = 'Gender is required';

    if (!data.country) newErrors.country = 'Country is required';

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else {
      if (data.password.length < MAX_LENGTH_NUMBER)
        newErrors.password = 'Password must be at least 8 characters';
      if (!/[a-z]/.test(data.password))
        newErrors.password = 'Password must contain a lowercase letter';
      if (!/[A-Z]/.test(data.password))
        newErrors.password = 'Password must contain an uppercase letter';
      if (!/[0-9]/.test(data.password)) newErrors.password = 'Password must contain a number';
      if (!/[!@#$%^&*]/.test(data.password))
        newErrors.password = 'Password must contain a special character';
    }

    if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Passwords must match';

    if (!data.acceptTerms) newErrors.acceptTerms = 'Accept T&C';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'photo' && type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] ?? null;
      setData((prev) => ({ ...prev, photo: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(
        addEntry({
          id: Date.now().toString(),
          name: data.name,
          age: Number(data.age),
          email: data.email,
          password: data.password,
          gender: data.gender as 'male' | 'female',
          acceptTerms: data.acceptTerms,
          country: data.country,
          photo: reader.result as string,
        })
      );
      onClose();
    };

    if (data.photo) reader.readAsDataURL(data.photo);
    else reader.readAsDataURL(new Blob());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-bold text-xl">Controlled Form</h2>

      <Input
        label="Name"
        placeholder="Name"
        name="name"
        value={data.name}
        onChange={handleChange}
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <Input
        label="Age"
        type="number"
        placeholder="Age"
        name="age"
        value={data.age}
        onChange={handleChange}
      />
      {errors.age && <p className="error">{errors.age}</p>}

      <Input
        label="Email"
        type="email"
        placeholder="Email"
        name="email"
        value={data.email}
        onChange={handleChange}
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <Input
        label="Password"
        type="password"
        placeholder="Password"
        name="password"
        value={data.password}
        onChange={handleChange}
      />
      {errors.password && <p className="error">{errors.password}</p>}

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        value={data.confirmPassword}
        onChange={handleChange}
      />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

      <div className="px-3">
        <label className="block text-gray-500 text-sm font-medium">Country</label>
        <select
          name="country"
          value={data.country}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country && <p className="error">{errors.country}</p>}
      </div>

      <GenderPicker
        value={data.gender}
        onChange={(value) => setData((prev) => ({ ...prev, gender: value }))}
      />
      {errors.gender && <p className="error">{errors.gender}</p>}

      <div className="px-3">
        <label className="block text-gray-500 text-sm font-medium mb-1">
          Photo (PNG/JPEG, 5MB)
        </label>
        <input
          type="file"
          name="photo"
          accept=".png,.jpg,.jpeg"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        {photoPreview && (
          <img src={photoPreview} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded" />
        )}
      </div>
      {errors.photo && <p className="error">{errors.photo}</p>}

      <Checkbox
        label="Accept Terms and Conditions"
        name="acceptTerms"
        checked={data.acceptTerms}
        onChange={(e) => setData((prev) => ({ ...prev, acceptTerms: e.target.checked }))}
      />
      {errors.acceptTerms && <p className="error">{errors.acceptTerms}</p>}

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
