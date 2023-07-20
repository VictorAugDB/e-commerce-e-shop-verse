export default function Cart() {
  return (
    <div>
      <table>
        <thead className='hidden md:table-header-group'>
          <tr>
            <th className='h-0 w-0 py-6 pl-10 text-center'>Product</th>
            <th className='px-[4.375rem] py-6 text-center'>Price</th>
            <th className='px-[4.375rem] py-6 text-center'>Quantity</th>
            <th className='py-6 pr-10 text-center'>Subtotal</th>
          </tr>
        </thead>
        <tbody className=''>
          <tr>
            <td
              className='py-10 pl-10 text-center before:content-[attr(data-heading)] md:before:content-[]'
              data-heading='Product: '
            >
              LCD Monitor
            </td>
            <td
              className='py-10 text-center before:content-[attr(data-heading)] md:before:content-[]'
              data-heading='Price: '
            >
              $650
            </td>
            <td
              className='py-10 text-center before:content-[attr(data-heading)] md:before:content-[]'
              data-heading='Quantity: '
            >
              01
            </td>
            <td
              className='py-10 pr-10 text-center before:content-[attr(data-heading)] md:before:content-[]'
              data-heading='Subtotal: '
            >
              $650
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
