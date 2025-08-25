import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from '../../store/hooks';
import { addEntry } from '../../store/formSlice';
import { useAppSelector } from '../../store/hooks';
import { Input, Checkbox, GenderPicker, Button } from '../Inputs';

const ONE_KB = 1024;
const MAX_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_MB * ONE_KB * ONE_KB;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / ONE_KB / ONE_KB;
const MIN_PASSWORD_LENGTH = 8;

interface FormData {
  name: string;
  age: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female';
  acceptTerms: boolean;
  country: string;
  photo: File | null;
}

const schema = yup
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
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
      .matches(/[a-z]/, 'Password must contain a lowercase letter')
      .matches(/[A-Z]/, 'Password must contain an uppercase letter')
      .matches(/[0-9]/, 'Password must contain a number')
      .matches(/[!@#$%^&*]/, 'Password must contain a special character'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password'),
    gender: yup
      .mixed<'male' | 'female'>()
      .oneOf(['male', 'female'], 'Gender is required')
      .required('Gender is required'),
    acceptTerms: yup.boolean().oneOf([true], 'Accept T&C').required('Accept T&C'),
    country: yup.string().required('Country is required'),
    photo: yup
      .mixed<File>()
      .nullable()
      .test('fileType', 'Only .png and .jpg allowed', (value) => {
        if (!value) return true;
        return ['image/png', 'image/jpeg'].includes(value.type);
      })
      .test('fileSize', `Max ${MAX_FILE_SIZE_MB}MB`, (value) => {
        if (!value) return true;
        return value.size <= MAX_FILE_SIZE_BYTES;
      }),
  })
  .defined() as yup.ObjectSchema<FormData>;

export default function HookForm({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector((state) => state.form);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const watchPhoto = watch('photo');

  const onSubmit = (data: FormData) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(
        addEntry({
          id: Date.now().toString(),
          name: data.name,
          age: Number(data.age),
          email: data.email,
          password: data.password,
          gender: data.gender,
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

  const photoPreview = watchPhoto ? URL.createObjectURL(watchPhoto) : null;

  return (
    <form onSubmit={void handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="font-bold text-xl">React Hook Form</h2>

      <Input label="Name" placeholder="Name" {...register('name')} />
      {errors.name && <p className="error">{errors.name.message}</p>}

      <Input label="Age" type="number" placeholder="Age" {...register('age')} />
      {errors.age && <p className="error">{errors.age.message}</p>}

      <Input label="Email" type="email" placeholder="Email" {...register('email')} />
      {errors.email && <p className="error">{errors.email.message}</p>}

      <Input label="Password" type="password" placeholder="Password" {...register('password')} />
      {errors.password && <p className="error">{errors.password.message}</p>}

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm Password"
        {...register('confirmPassword')}
      />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

      <div className="px-3">
        <label className="block text-gray-500 text-sm font-medium">Country</label>
        <select
          {...register('country')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country && <p className="error">{errors.country.message}</p>}
      </div>

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <GenderPicker value={field.value || ''} onChange={(value) => field.onChange(value)} />
        )}
      />
      {errors.gender && <p className="error">{errors.gender.message}</p>}

      <Controller
        name="photo"
        control={control}
        render={({ field }) => (
          <div className="px-3">
            <label className="block text-gray-500 text-sm font-medium mb-1">
              Photo (PNG/JPEG, {MAX_FILE_SIZE_MB}MB)
            </label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-2 w-16 h-16 object-cover rounded"
              />
            )}
          </div>
        )}
      />
      {errors.photo && <p className="error">{errors.photo.message}</p>}

      <Controller
        name="acceptTerms"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Accept Terms and Conditions"
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />
      {errors.acceptTerms && <p className="error">{errors.acceptTerms.message}</p>}

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          Submit
        </Button>
      </div>
    </form>
  );
}
