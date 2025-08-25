import clsx from 'clsx';

type Gender = 'male' | 'female';

const GENDER_LABELS: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
};

interface GenderPickerProps {
  value: Gender | '';
  onChange: (value: Gender) => void;
}

export default function GenderPicker({ value, onChange }: GenderPickerProps) {
  return (
    <fieldset className="px-3">
      <legend className="text-gray-500 text-sm font-medium mb-2">Gender</legend>
      <div className="flex flex-wrap gap-4">
        {Object.entries(GENDER_LABELS).map(([gender, label]) => (
          <label
            key={gender}
            className={clsx(
              'flex items-center gap-3 cursor-pointer select-none',
              'p-2 rounded-lg transition-all duration-200',
              value === gender
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'border-2 border-transparent hover:bg-gray-100'
            )}
          >
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={value === gender}
              onChange={() => onChange(gender as Gender)}
              className="peer sr-only"
            />
            <span
              className={clsx(
                'h-5 w-5 rounded-full border-2 border-gray-400',
                'peer-checked:border-blue-500 peer-checked:bg-blue-500',
                'transition-colors duration-200'
              )}
            />
            <span
              className={clsx('font-medium', value === gender ? 'text-blue-700' : 'text-gray-700')}
            >
              {label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
