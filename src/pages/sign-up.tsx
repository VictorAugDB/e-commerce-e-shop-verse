import Button from '@/components/buttons/Button';

export default function signUp() {
  return (
    <div className='flex flex-1 gap-32'>
      <div></div>
      <div className='flex flex-col gap-12'>
        <div className='flex flex-col gap-6'>
          <h1>Create an account</h1>
          <p>Enter your details below</p>
        </div>
        <div className='flex flex-col gap-10'>
          <Input placeholder='Name' />
          <Input placeholder='E-mail Phone Number' />
          <Input placeholder='Password' />
        </div>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <Button variant='green' className='flex w-full justify-center py-4'>
              Create Account
            </Button>
            <Button variant='green' className='flex w-full justify-center py-4'>
              Google Button Here
            </Button>
          </div>
          <div className='flex justify-center gap-4'>
            <p>Already have account?</p>
            <a
              href='/sign-in'
              className='border-b border-gray-800 pb-1 font-medium text-gray-800'
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  placeholder: string;
};

function Input({ placeholder }: InputProps) {
  return (
    <div className='border-b border-gray-600 transition focus-within:border-green-700'>
      <input
        type='text'
        className='w-full border-0 bg-transparent p-0 pb-2 outline-none focus:ring-0'
        placeholder={placeholder}
      />
    </div>
  );
}
