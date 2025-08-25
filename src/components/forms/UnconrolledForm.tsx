import { useRef, useState } from 'react';
import * as yup from 'yup';
import { useAppDispatch } from '../../store/hooks';
import { addEntry } from '../../store/formSlice';
import { useAppSelector } from '../../store/hooks';
import { Input, Checkbox, GenderPicker, Button } from '../../components/Inputs';

interface FormData {
  name: string;
  age: string;
  email: string;
  gender: 'male' | 'female';
  acceptTerms: boolean;
  country: string;
  photo: File | null;
  password: string;
  confirmPassword: string;
}

type Errors = Partial<Record<keyof FormData, string>>;

const schema: yup.ObjectSchema<FormData> = yup
  .object({
    name: yup
      .string()
      .required('Name is required')
      .matches(/^[A-Z]/, 'First letter must be uppercase'),
    age: yup
      .string()
      .required('Age is required')
      .test('is-number', 'Must be a number', (value) => !isNaN(Number(value)))
      .test('is-positive', 'Must be positive', (value) => Number(value) > 0)
      .test('is-integer', 'Must be integer', (value) => Number.isInteger(Number(value))),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain a lowercase letter')
      .matches(/[A-Z]/, 'Password must contain an uppercase letter')
      .matches(/[0-9]/, 'Password must contain a number')
      .matches(/[!@#$%^&*]/, 'Password must contain a special character'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password'),
    gender: yup.mixed<'male' | 'female'>().oneOf(['male', 'female']).required('Gender is required'),
    acceptTerms: yup.boolean().oneOf([true], 'Accept T&C').required('Accept T&C'),
    country: yup.string().required('Country is required'),
    photo: yup
      .mixed<File>()
      .nullable()
      .test('fileType', 'Only .png and .jpg allowed', (value) => {
        if (!value) return true;
        return ['image/png', 'image/jpeg'].includes(value.type);
      })
      .test('fileSize', 'Max 5MB', (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      }),
  })
  .defined();

export default function UncontrolledForm({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector((state) => state.form);

  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);

    const formDataValues: FormData = {
      name: (formData.get('name') as string) || '',
      age: (formData.get('age') as string) || '',
      email: (formData.get('email') as string) || '',
      password: (formData.get('password') as string) || '',
      confirmPassword: (formData.get('confirmPassword') as string) || '',
      gender: (formData.get('gender') as 'male' | 'female') || ('' as 'male' | 'female'),
      country: (formData.get('country') as string) || '',
      acceptTerms: !!formData.get('acceptTerms'),
      photo: (formData.get('photo') as File | null) ?? null,
    };

    schema
      .validate(formDataValues, { abortEarly: false })
      .then(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const entry = {
            id: Date.now().toString(),
            name: formDataValues.name,
            age: Number(formDataValues.age),
            email: formDataValues.email,
            password: formDataValues.password,
            gender: formDataValues.gender,
            acceptTerms: formDataValues.acceptTerms,
            country: formDataValues.country,
            photo: reader.result as string,
          };
          dispatch(addEntry(entry));
          onClose();
        };
        if (formDataValues.photo) reader.readAsDataURL(formDataValues.photo);
        else reader.readAsDataURL(new Blob());
      })
      .catch((err: yup.ValidationError) => {
        const newErrors: Errors = {};
        err.inner.forEach((e) => {
          if (e.path) {
            newErrors[e.path as keyof FormData] = e.message;
          }
        });
        setErrors(newErrors);
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  return (
    <form ref={formRef} onSubmit={validateAndSubmit} className="space-y-4">
      <h2 className="font-bold text-xl">Uncontrolled Form</h2>

      <Input label="Name" name="name" placeholder="Name" />
      {errors.name && <p className="error">{errors.name}</p>}

      <Input label="Age" type="number" name="age" placeholder="Age" />
      {errors.age && <p className="error">{errors.age}</p>}

      <Input label="Email" type="email" name="email" placeholder="Email" />
      {errors.email && <p className="error">{errors.email}</p>}

      <Input label="Password" type="password" name="password" placeholder="Password" />
      {errors.password && <p className="error">{errors.password}</p>}

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

      <div className="px-3">
        <label className="block text-gray-500 text-sm font-medium">Country</label>
        <select name="country" className="w-full border border-gray-300 rounded-lg px-3 py-2">
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
        value=""
        onChange={(value) => {
          const inputs = formRef.current?.querySelectorAll('input[name="gender"]');
          inputs?.forEach((input) => {
            input.checked = input.value === value;
          });
        }}
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
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        {photoPreview && (
          <img src={photoPreview} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded" />
        )}
      </div>
      {errors.photo && <p className="error">{errors.photo}</p>}

      <Checkbox label="Accept Terms and Conditions" name="acceptTerms" />
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
