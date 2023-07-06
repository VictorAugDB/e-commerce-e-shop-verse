export default function Footer() {
  return (
    <div className='h-[27.5rem] bg-black px-[8.4375rem] pb-6 pt-20'>
      <div className='flex items-start gap-[5.4375rem]'>
        <div className='flex flex-col gap-6'>
          <h3>Exclusive</h3>
          <h4 className='font-medium'>Subscribe</h4>
          <p>Get 10% off your first order</p>
        </div>
        <div className='flex flex-col gap-6'>
          <h4 className='font-medium'>Support</h4>
          <div className='flex flex-col gap-4'>
            <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
            <p>exclusive@gmail.com</p>
            <p>+88015-88888-9999</p>
          </div>
        </div>
        <div className='flex flex-col gap-6'>
          <h4 className='font-medium'>Account</h4>
          <div className='flex flex-col gap-4'>
            <p>My Account</p>
            <p>Login / Register</p>
            <p>Cart</p>
            <p>Wishlist</p>
            <p>Shop</p>
          </div>
        </div>
        <div className='flex flex-col gap-6'>
          <h4 className='font-medium'>Quick Link</h4>
          <div className='flex flex-col gap-4'>
            <p>Privacy Policy</p>
            <p>Terms Of Use</p>
            <p>FAQ</p>
            <p>Contact</p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
